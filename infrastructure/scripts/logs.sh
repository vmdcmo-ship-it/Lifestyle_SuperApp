#!/bin/bash

# ============================================================================
# Log Viewer Script - Lifestyle Super App
# ============================================================================
# Quick access to logs for all services
# Usage: bash infrastructure/scripts/logs.sh [service-name] [options]
# ============================================================================

DOCKER_COMPOSE_FILE="infrastructure/docker/docker-compose.production.yml"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_help() {
    echo "Usage: bash infrastructure/scripts/logs.sh [service] [options]"
    echo ""
    echo "Services:"
    echo "  all              - All services (default)"
    echo "  web              - Next.js Web App"
    echo "  main-api         - Main API Service"
    echo "  user-service     - User Service"
    echo "  postgres         - PostgreSQL Database"
    echo "  redis            - Redis Cache"
    echo "  nginx            - Nginx Proxy"
    echo ""
    echo "Options:"
    echo "  -f, --follow     - Follow log output (default)"
    echo "  -n, --tail N     - Show last N lines (default: 50)"
    echo "  -h, --help       - Show this help"
    echo ""
    echo "Examples:"
    echo "  bash infrastructure/scripts/logs.sh web"
    echo "  bash infrastructure/scripts/logs.sh main-api --tail 100"
    echo "  bash infrastructure/scripts/logs.sh all --follow"
}

SERVICE="all"
TAIL_LINES="50"
FOLLOW=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        web|main-api|user-service|postgres|redis|nginx|all)
            SERVICE=$1
            shift
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n|--tail)
            TAIL_LINES=$2
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Map service names to container names
case $SERVICE in
    web)
        CONTAINER="lifestyle_web"
        ;;
    main-api)
        CONTAINER="lifestyle_main_api"
        ;;
    user-service)
        CONTAINER="lifestyle_user_service"
        ;;
    postgres)
        CONTAINER="lifestyle_postgres_prod"
        ;;
    redis)
        CONTAINER="lifestyle_redis_prod"
        ;;
    nginx)
        CONTAINER="lifestyle_nginx"
        ;;
    all)
        CONTAINER=""
        ;;
esac

echo -e "${GREEN}Viewing logs for: ${YELLOW}$SERVICE${NC}"
echo "Press Ctrl+C to exit"
echo ""

# Show logs
if [ -z "$CONTAINER" ]; then
    # All services
    if [ "$FOLLOW" = true ]; then
        docker compose -f "$DOCKER_COMPOSE_FILE" logs -f --tail="$TAIL_LINES"
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail="$TAIL_LINES"
    fi
else
    # Specific service
    if [ "$FOLLOW" = true ]; then
        docker logs "$CONTAINER" -f --tail="$TAIL_LINES"
    else
        docker logs "$CONTAINER" --tail="$TAIL_LINES"
    fi
fi
