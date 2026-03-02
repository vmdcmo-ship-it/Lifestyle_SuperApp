#!/bin/bash

# ============================================================================
# Initial VPS Setup Script - Lifestyle Super App
# ============================================================================
# This script prepares a fresh Ubuntu/Debian VPS for Docker deployment
# Run as root: sudo bash initial-setup.sh
# ============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

check_root() {
    if [[ $EUID -ne 0 ]]; then
       log_error "This script must be run as root (use sudo)"
       exit 1
    fi
}

# ============================================================================
# MAIN SETUP FUNCTIONS
# ============================================================================

update_system() {
    log_info "Updating system packages..."
    apt-get update -y
    apt-get upgrade -y
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common \
        wget \
        git \
        vim \
        htop \
        net-tools \
        ufw
    log_info "System updated successfully"
}

install_docker() {
    log_info "Installing Docker..."
    
    # Remove old versions if exist
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Verify installation
    docker --version
    log_info "Docker installed successfully"
}

install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    # Docker Compose V2 is already installed with docker-compose-plugin
    # Create alias for docker-compose command
    echo 'alias docker-compose="docker compose"' >> ~/.bashrc
    
    docker compose version
    log_info "Docker Compose installed successfully"
}

setup_firewall() {
    log_info "Configuring firewall (UFW)..."
    
    # Reset UFW to default
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (important!)
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Enable UFW
    ufw --force enable
    
    # Show status
    ufw status verbose
    
    log_info "Firewall configured successfully"
}

install_nginx() {
    log_info "Installing Nginx..."
    
    apt-get install -y nginx
    
    # Stop nginx (we'll use Docker nginx)
    systemctl stop nginx
    systemctl disable nginx
    
    log_info "Nginx installed (will be managed by Docker)"
}

install_certbot() {
    log_info "Installing Certbot for SSL certificates..."
    
    apt-get install -y certbot python3-certbot-nginx
    
    log_info "Certbot installed successfully"
}

create_app_directory() {
    log_info "Creating application directory..."
    
    APP_DIR="/opt/lifestyle-superapp"
    
    if [ -d "$APP_DIR" ]; then
        log_warn "Directory $APP_DIR already exists"
    else
        mkdir -p $APP_DIR
        log_info "Created directory: $APP_DIR"
    fi
    
    # Create necessary subdirectories
    mkdir -p $APP_DIR/logs
    mkdir -p $APP_DIR/backups
    mkdir -p $APP_DIR/uploads
    mkdir -p $APP_DIR/ssl
    
    # Set permissions
    chmod 755 $APP_DIR
    
    log_info "Application directories created"
}

setup_swap() {
    log_info "Setting up swap space (2GB)..."
    
    # Check if swap already exists
    if swapon --show | grep -q '/swapfile'; then
        log_warn "Swap file already exists"
        return
    fi
    
    # Create swap file
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Make it permanent
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    
    # Optimize swappiness
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p
    
    log_info "Swap space configured"
}

optimize_system() {
    log_info "Applying system optimizations..."
    
    # Increase file descriptor limits
    cat >> /etc/security/limits.conf <<EOF
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF
    
    # Kernel parameters for better network performance
    cat >> /etc/sysctl.conf <<EOF

# Lifestyle SuperApp optimizations
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
fs.file-max = 2097152
EOF
    
    sysctl -p
    
    log_info "System optimizations applied"
}

setup_logging() {
    log_info "Configuring log rotation..."
    
    cat > /etc/logrotate.d/lifestyle-superapp <<EOF
/opt/lifestyle-superapp/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        systemctl reload docker > /dev/null 2>&1 || true
    endscript
}
EOF
    
    log_info "Log rotation configured"
}

create_deploy_user() {
    log_info "Creating deployment user..."
    
    # Create user if doesn't exist
    if id "deployer" &>/dev/null; then
        log_warn "User 'deployer' already exists"
    else
        useradd -m -s /bin/bash deployer
        usermod -aG docker deployer
        log_info "User 'deployer' created and added to docker group"
    fi
    
    # Setup SSH directory
    mkdir -p /home/deployer/.ssh
    chmod 700 /home/deployer/.ssh
    chown -R deployer:deployer /home/deployer/.ssh
    
    log_info "Deployment user configured"
}

setup_monitoring() {
    log_info "Installing basic monitoring tools..."
    
    apt-get install -y \
        sysstat \
        iotop \
        iftop \
        nethogs
    
    log_info "Monitoring tools installed"
}

install_nodejs() {
    log_info "Installing Node.js 20 LTS..."
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    # Install pnpm
    npm install -g pnpm@latest
    
    # Verify installations
    node --version
    npm --version
    pnpm --version
    
    log_info "Node.js and pnpm installed successfully"
}

display_summary() {
    log_info "============================================"
    log_info "VPS Setup Complete!"
    log_info "============================================"
    echo ""
    log_info "Next Steps:"
    echo "1. Upload your project code to: /opt/lifestyle-superapp"
    echo "2. Configure environment variables: cp infrastructure/.env.production.template infrastructure/.env.production"
    echo "3. Edit .env.production with your actual values"
    echo "4. Setup SSL certificates: bash infrastructure/scripts/setup-ssl.sh"
    echo "5. Deploy the application: bash infrastructure/scripts/deploy.sh"
    echo ""
    log_info "Installed Components:"
    echo "  - Docker: $(docker --version)"
    echo "  - Docker Compose: $(docker compose version)"
    echo "  - Node.js: $(node --version)"
    echo "  - pnpm: $(pnpm --version)"
    echo "  - Certbot: $(certbot --version)"
    echo ""
    log_info "Application Directory: /opt/lifestyle-superapp"
    log_info "Deployment User: deployer"
    echo ""
    log_warn "IMPORTANT: Before deploying, make sure to:"
    echo "  1. Point your domain (vmd.asia) to this server's IP"
    echo "  2. Generate secure passwords and secrets"
    echo "  3. Configure all API keys in .env.production"
    echo ""
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    log_info "Starting VPS Initial Setup..."
    echo ""
    
    check_root
    update_system
    install_docker
    install_docker_compose
    install_nodejs
    setup_firewall
    install_nginx
    install_certbot
    create_app_directory
    setup_swap
    optimize_system
    setup_logging
    create_deploy_user
    setup_monitoring
    
    echo ""
    display_summary
    
    log_info "Setup script completed successfully!"
    log_warn "A system reboot is recommended. Run: sudo reboot"
}

# Run main function
main "$@"
