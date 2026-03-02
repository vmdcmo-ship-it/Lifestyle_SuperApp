#!/bin/bash

# ============================================================================
# Deployment Script - Lifestyle Super App
# ============================================================================
# Automated deployment with zero-downtime strategy
# Usage: bash infrastructure/scripts/deploy.sh [options]
# Options:
#   --profile extended    Deploy with extended services
#   --no-build           Skip building images (use existing)
#   --rollback           Rollback to previous version
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/lifestyle-superapp"
DOCKER_COMPOSE_FILE="infrastructure/docker/docker-compose.production.yml"
ENV_FILE="infrastructure/.env.production"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Options
PROFILE=""
SKIP_BUILD=false
DO_ROLLBACK=false

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

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --profile)
                PROFILE="$2"
                shift 2
                ;;
            --no-build)
                SKIP_BUILD=true
                shift
                ;;
            --rollback)
                DO_ROLLBACK=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
}

check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if running in correct directory
    if [ ! -f "package.json" ]; then
        log_error "Must run from project root directory"
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file not found: $ENV_FILE"
        log_info "Copy from template: cp $ENV_FILE.template $ENV_FILE"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi
    
    # Check if docker-compose file exists
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        log_error "Docker Compose file not found: $DOCKER_COMPOSE_FILE"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

backup_current_state() {
    log_step "Creating backup of current state..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup environment file
    cp "$ENV_FILE" "$BACKUP_DIR/env_$TIMESTAMP"
    
    # Export current Docker images list
    docker compose -f "$DOCKER_COMPOSE_FILE" images > "$BACKUP_DIR/images_$TIMESTAMP.txt"
    
    # Backup database
    if docker ps | grep -q lifestyle_postgres_prod; then
        log_info "Backing up database..."
        docker exec lifestyle_postgres_prod pg_dump -U lifestyle_admin lifestyle_db > "$BACKUP_DIR/db_$TIMESTAMP.sql"
        log_info "Database backup saved: $BACKUP_DIR/db_$TIMESTAMP.sql"
    fi
    
    log_info "Backup completed"
}

pull_latest_code() {
    log_step "Pulling latest code from repository..."
    
    if [ -d ".git" ]; then
        git fetch origin
        git pull origin main || git pull origin master
        log_info "Code updated from repository"
    else
        log_warn "Not a git repository, skipping pull"
    fi
}

install_dependencies() {
    log_step "Installing dependencies..."
    
    if ! command -v pnpm &> /dev/null; then
        log_info "pnpm not found, installing globally..."
        npm install -g pnpm
    fi
    pnpm install --frozen-lockfile
    
    log_info "Dependencies installed"
}

build_docker_images() {
    if [ "$SKIP_BUILD" = true ]; then
        log_warn "Skipping image build (--no-build flag)"
        return
    fi
    
    log_step "Building Docker images..."
    
    # Load environment variables
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    
    # Build images based on profile
    if [ -n "$PROFILE" ]; then
        log_info "Building with profile: $PROFILE"
        docker compose -f "$DOCKER_COMPOSE_FILE" --profile "$PROFILE" build --no-cache
    else
        log_info "Building core services only"
        docker compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    fi
    
    log_info "Docker images built successfully"
}

run_database_migrations() {
    log_step "Running database migrations..."
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    sleep 10
    
    # Check if migrations are needed
    if [ -d "services/main-api/prisma" ]; then
        log_info "Running Prisma migrations..."
        docker exec lifestyle_main_api npx prisma migrate deploy || true
    fi
    
    log_info "Database migrations completed"
}

health_check() {
    log_step "Performing health checks..."
    
    local max_attempts=30
    local attempt=1
    
    # Check main API
    log_info "Checking Main API health..."
    while [ $attempt -le $max_attempts ]; do
        if docker exec lifestyle_main_api wget -q --spider http://localhost:3000/health 2>/dev/null; then
            log_info "Main API is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Main API health check failed after $max_attempts attempts"
            return 1
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        ((attempt++))
    done
    
    # Check User Service
    log_info "Checking User Service health..."
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker exec lifestyle_user_service wget -q --spider http://localhost:3002/health 2>/dev/null; then
            log_info "User Service is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "User Service health check failed"
            return 1
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        ((attempt++))
    done
    
    # Check Web App
    log_info "Checking Web App health..."
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker exec lifestyle_web wget -q --spider http://localhost:3001 2>/dev/null; then
            log_info "Web App is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Web App health check failed"
            return 1
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        ((attempt++))
    done
    
    log_info "All health checks passed"
    return 0
}

deploy_services() {
    log_step "Deploying services..."
    
    # Load environment variables
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    
    if [ -n "$PROFILE" ]; then
        log_info "Deploying with profile: $PROFILE"
        docker compose -f "$DOCKER_COMPOSE_FILE" --profile "$PROFILE" up -d --remove-orphans
    else
        log_info "Deploying core services only"
        docker compose -f "$DOCKER_COMPOSE_FILE" up -d --remove-orphans
    fi
    
    log_info "Services deployed"
}

cleanup_old_images() {
    log_step "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old images (keep last 2 versions)
    docker images --format "{{.Repository}}:{{.Tag}}" | grep "lifestyle" | tail -n +3 | xargs -r docker rmi -f || true
    
    log_info "Cleanup completed"
}

rollback_deployment() {
    log_step "Rolling back to previous version..."
    
    # Find latest backup
    latest_backup=$(ls -t "$BACKUP_DIR"/db_*.sql 2>/dev/null | head -n1)
    
    if [ -z "$latest_backup" ]; then
        log_error "No backup found for rollback"
        exit 1
    fi
    
    log_warn "Restoring from backup: $latest_backup"
    
    # Stop current services
    docker compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Restore database
    if [ -f "$latest_backup" ]; then
        docker compose -f "$DOCKER_COMPOSE_FILE" up -d postgres
        sleep 10
        docker exec -i lifestyle_postgres_prod psql -U lifestyle_admin lifestyle_db < "$latest_backup"
    fi
    
    # Start previous version
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    log_info "Rollback completed"
}

display_status() {
    log_step "Deployment Summary"
    echo ""
    
    # Show running containers
    log_info "Running containers:"
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
    echo ""
    
    # Show resource usage
    log_info "Resource usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    echo ""
    
    # Show logs (last 20 lines)
    log_info "Recent logs:"
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=20
    echo ""
    
    log_info "============================================"
    log_info "Deployment completed successfully!"
    log_info "============================================"
    echo ""
    log_info "Access your application:"
    echo "  - Web: https://vmd.asia"
    echo "  - API: https://api.vmd.asia"
    echo "  - Auth: https://auth.vmd.asia"
    echo ""
    log_info "Useful commands:"
    echo "  - View logs: docker compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "  - Check status: docker compose -f $DOCKER_COMPOSE_FILE ps"
    echo "  - Restart service: docker compose -f $DOCKER_COMPOSE_FILE restart <service>"
    echo "  - Stop all: docker compose -f $DOCKER_COMPOSE_FILE down"
    echo ""
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    log_info "Starting deployment process..."
    echo ""
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Handle rollback
    if [ "$DO_ROLLBACK" = true ]; then
        rollback_deployment
        exit 0
    fi
    
    # Normal deployment flow
    check_prerequisites
    backup_current_state
    pull_latest_code
    install_dependencies
    build_docker_images
    deploy_services
    
    # Wait a bit for services to start
    sleep 15
    
    run_database_migrations
    
    # Health checks
    if health_check; then
        cleanup_old_images
        display_status
    else
        log_error "Health checks failed!"
        log_warn "Rolling back deployment..."
        rollback_deployment
        exit 1
    fi
    
    log_info "Deployment completed successfully!"
}

# Run main function
main "$@"
