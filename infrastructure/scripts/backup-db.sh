#!/bin/bash

# ============================================================================
# Database Backup Script - Lifestyle Super App
# ============================================================================
# Creates timestamped PostgreSQL database backups
# Usage: bash infrastructure/scripts/backup-db.sh
# ============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/opt/lifestyle-superapp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lifestyle_db_$TIMESTAMP.sql"
CONTAINER="lifestyle_postgres_prod"
DB_USER="lifestyle_admin"
DB_NAME="lifestyle_db"
RETENTION_DAYS=30

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER"; then
    log_error "PostgreSQL container is not running!"
    exit 1
fi

log_info "Starting database backup..."

# Create backup
log_info "Backing up database: $DB_NAME"
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    # Compress backup
    log_info "Compressing backup..."
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    
    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    log_info "Backup created successfully!"
    log_info "File: $BACKUP_FILE"
    log_info "Size: $SIZE"
    
    # Clean old backups
    log_info "Cleaning old backups (keeping last $RETENTION_DAYS days)..."
    find "$BACKUP_DIR" -name "lifestyle_db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    # List recent backups
    echo ""
    log_info "Recent backups:"
    ls -lh "$BACKUP_DIR" | tail -n 5
    
else
    log_error "Backup failed!"
    exit 1
fi

log_info "Backup completed successfully!"
