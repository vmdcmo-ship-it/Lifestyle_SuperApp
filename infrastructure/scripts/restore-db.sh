#!/bin/bash

# ============================================================================
# Database Restore Script - Lifestyle Super App
# ============================================================================
# Restores PostgreSQL database from backup
# Usage: bash infrastructure/scripts/restore-db.sh <backup-file>
# ============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/opt/lifestyle-superapp/backups"
CONTAINER="lifestyle_postgres_prod"
DB_USER="lifestyle_admin"
DB_NAME="lifestyle_db"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if backup file is provided
if [ $# -eq 0 ]; then
    log_error "No backup file specified!"
    echo ""
    echo "Usage: bash infrastructure/scripts/restore-db.sh <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q "$CONTAINER"; then
    log_error "PostgreSQL container is not running!"
    exit 1
fi

# Warning
log_warn "============================================"
log_warn "WARNING: This will OVERWRITE the current database!"
log_warn "Database: $DB_NAME"
log_warn "Backup: $BACKUP_FILE"
log_warn "============================================"
read -p "Are you sure you want to continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log_info "Restore cancelled"
    exit 0
fi

log_info "Starting database restore..."

# Decompress if needed
TEMP_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log_info "Decompressing backup..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
fi

# Drop existing connections
log_info "Terminating active connections..."
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME' AND pid <> pg_backend_pid();"

# Drop and recreate database
log_info "Recreating database..."
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
log_info "Restoring from backup..."
cat "$TEMP_FILE" | docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"

if [ $? -eq 0 ]; then
    log_info "Database restored successfully!"
    
    # Cleanup temp file if it was decompressed
    if [[ "$BACKUP_FILE" == *.gz ]] && [ -f "$TEMP_FILE" ]; then
        rm "$TEMP_FILE"
    fi
    
    log_info "Restore completed!"
else
    log_error "Restore failed!"
    exit 1
fi
