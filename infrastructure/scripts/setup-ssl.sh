#!/bin/bash

# ============================================================================
# SSL Certificate Setup Script - Lifestyle Super App
# ============================================================================
# Obtains and configures Let's Encrypt SSL certificates for all domains
# Usage: bash infrastructure/scripts/setup-ssl.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="vmd.asia"
WWW_DOMAIN="www.vmd.asia"
API_DOMAIN="api.vmd.asia"
AUTH_DOMAIN="auth.vmd.asia"
EMAIL="admin@vmd.asia"  # Change this to your email
CERT_DIR="/opt/lifestyle-superapp/ssl"
WEBROOT="/var/www/certbot"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
       log_error "This script must be run as root (use sudo)"
       exit 1
    fi
}

check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot is not installed. Run initial-setup.sh first."
        exit 1
    fi
    
    # Check if domains are pointing to this server
    SERVER_IP=$(curl -s ifconfig.me)
    log_info "Server IP: $SERVER_IP"
    
    for domain in $DOMAIN $WWW_DOMAIN $API_DOMAIN $AUTH_DOMAIN; do
        DOMAIN_IP=$(dig +short $domain | tail -n1)
        log_info "Checking $domain -> $DOMAIN_IP"
        
        if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
            log_warn "Domain $domain is not pointing to this server!"
            log_warn "Expected: $SERVER_IP, Got: $DOMAIN_IP"
            log_error "Please update DNS records before continuing"
            exit 1
        fi
    done
    
    log_info "All domains are correctly configured"
}

create_directories() {
    log_step "Creating necessary directories..."
    
    mkdir -p $CERT_DIR
    mkdir -p $WEBROOT
    
    log_info "Directories created"
}

setup_temporary_nginx() {
    log_step "Setting up temporary Nginx for verification..."
    
    # Create temporary Nginx config for ACME challenge
    cat > /etc/nginx/sites-available/certbot-temp <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN $API_DOMAIN $AUTH_DOMAIN;

    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }

    location / {
        return 200 'Certbot verification in progress...';
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable the config
    ln -sf /etc/nginx/sites-available/certbot-temp /etc/nginx/sites-enabled/
    
    # Remove default config if exists
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    nginx -t
    systemctl start nginx || systemctl reload nginx
    
    log_info "Temporary Nginx configured"
}

obtain_certificates() {
    log_step "Obtaining SSL certificates from Let's Encrypt..."
    
    log_info "This may take a few minutes..."
    
    # Obtain certificate for all domains
    certbot certonly \
        --webroot \
        --webroot-path=$WEBROOT \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN \
        -d $WWW_DOMAIN \
        -d $API_DOMAIN \
        -d $AUTH_DOMAIN
    
    if [ $? -eq 0 ]; then
        log_info "SSL certificates obtained successfully!"
    else
        log_error "Failed to obtain SSL certificates"
        exit 1
    fi
}

copy_certificates() {
    log_step "Copying certificates to application directory..."
    
    # Copy certificates to our directory
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERT_DIR/
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERT_DIR/
    cp /etc/letsencrypt/live/$DOMAIN/chain.pem $CERT_DIR/
    
    # Set proper permissions
    chmod 644 $CERT_DIR/fullchain.pem
    chmod 600 $CERT_DIR/privkey.pem
    chmod 644 $CERT_DIR/chain.pem
    
    log_info "Certificates copied to: $CERT_DIR"
}

setup_auto_renewal() {
    log_step "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > /opt/lifestyle-superapp/scripts/renew-certs.sh <<'EOF'
#!/bin/bash
# Auto-renewal script for SSL certificates

certbot renew --quiet --post-hook "systemctl reload nginx"

# Copy renewed certificates
cp /etc/letsencrypt/live/vmd.asia/fullchain.pem /opt/lifestyle-superapp/ssl/
cp /etc/letsencrypt/live/vmd.asia/privkey.pem /opt/lifestyle-superapp/ssl/
cp /etc/letsencrypt/live/vmd.asia/chain.pem /opt/lifestyle-superapp/ssl/

# Restart Docker Nginx container if running
if docker ps | grep -q lifestyle_nginx; then
    docker restart lifestyle_nginx
fi

echo "$(date): Certificates renewed successfully" >> /var/log/certbot-renewal.log
EOF
    
    chmod +x /opt/lifestyle-superapp/scripts/renew-certs.sh
    
    # Create cron job for renewal (runs twice daily)
    cat > /etc/cron.d/certbot-renewal <<EOF
# Renew SSL certificates twice daily
0 0,12 * * * root /opt/lifestyle-superapp/scripts/renew-certs.sh >> /var/log/certbot-renewal.log 2>&1
EOF
    
    log_info "Auto-renewal configured (runs twice daily)"
}

test_certificates() {
    log_step "Testing SSL certificates..."
    
    # Test certificate validity
    openssl x509 -in $CERT_DIR/fullchain.pem -text -noout | grep -A 2 "Validity"
    
    # Show certificate domains
    log_info "Certificate covers the following domains:"
    openssl x509 -in $CERT_DIR/fullchain.pem -text -noout | grep "DNS:" | tr ',' '\n' | sed 's/DNS://g'
    
    log_info "SSL certificate test passed"
}

cleanup_temporary_nginx() {
    log_step "Cleaning up temporary Nginx configuration..."
    
    # Stop Nginx (Docker will handle it)
    systemctl stop nginx
    systemctl disable nginx
    
    # Remove temporary config
    rm -f /etc/nginx/sites-enabled/certbot-temp
    
    log_info "Cleanup completed"
}

display_summary() {
    log_info "============================================"
    log_info "SSL Setup Complete!"
    log_info "============================================"
    echo ""
    log_info "SSL Certificates installed for:"
    echo "  - $DOMAIN"
    echo "  - $WWW_DOMAIN"
    echo "  - $API_DOMAIN"
    echo "  - $AUTH_DOMAIN"
    echo ""
    log_info "Certificate location: $CERT_DIR"
    echo "  - fullchain.pem"
    echo "  - privkey.pem"
    echo "  - chain.pem"
    echo ""
    log_info "Auto-renewal: Configured (runs twice daily)"
    echo ""
    log_info "Next Steps:"
    echo "1. Deploy your application: bash infrastructure/scripts/deploy.sh"
    echo "2. Your sites will be accessible via HTTPS"
    echo "3. Check renewal logs: tail -f /var/log/certbot-renewal.log"
    echo ""
    log_info "SSL Grade Check (after deployment):"
    echo "  https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
    echo ""
}

check_existing_certificates() {
    log_step "Checking for existing certificates..."
    
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        log_warn "Certificates already exist for $DOMAIN"
        read -p "Do you want to renew them? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Using existing certificates"
            copy_certificates
            test_certificates
            display_summary
            exit 0
        fi
    fi
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    log_info "Starting SSL certificate setup..."
    echo ""
    
    check_root
    check_existing_certificates
    check_prerequisites
    create_directories
    setup_temporary_nginx
    
    # Give DNS time to propagate if needed
    log_info "Waiting 10 seconds for DNS propagation..."
    sleep 10
    
    obtain_certificates
    copy_certificates
    setup_auto_renewal
    test_certificates
    cleanup_temporary_nginx
    
    echo ""
    display_summary
    
    log_info "SSL setup completed successfully!"
}

# Run main function
main "$@"
