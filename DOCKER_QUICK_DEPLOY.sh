#!/bin/bash

# ========================================
# LIFESTYLE SUPERAPP - DOCKER DEPLOYMENT
# Quick Deploy Script cho VPS
# ========================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="lifestyle-app"
IMAGE_NAME="lifestyle-app:latest"
CONTAINER_NAME="lifestyle-app"
PORT=3000
VPS_USER="your-username"
VPS_IP="your-vps-ip"

echo -e "${GREEN}=== Lifestyle SuperApp Docker Deployment ===${NC}\n"

# ========================================
# PHƯƠNG PHÁP 1: Export/Import
# ========================================
deploy_export_import() {
    echo -e "${YELLOW}[1/5] Building Docker image...${NC}"
    docker build -t $IMAGE_NAME .
    
    echo -e "${YELLOW}[2/5] Exporting image to tar file...${NC}"
    docker save -o ${APP_NAME}.tar $IMAGE_NAME
    
    echo -e "${YELLOW}[3/5] Uploading to VPS...${NC}"
    scp ${APP_NAME}.tar ${VPS_USER}@${VPS_IP}:/home/${VPS_USER}/
    
    echo -e "${YELLOW}[4/5] Loading image on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker load -i /home/${VPS_USER}/${APP_NAME}.tar"
    
    echo -e "${YELLOW}[5/5] Running container on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker stop $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker rm $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker run -d -p ${PORT}:${PORT} --name $CONTAINER_NAME --restart unless-stopped $IMAGE_NAME"
    
    echo -e "${GREEN}✓ Deployment completed!${NC}"
    echo -e "Access your app at: http://${VPS_IP}:${PORT}"
}

# ========================================
# PHƯƠNG PHÁP 2: Docker Hub
# ========================================
deploy_docker_hub() {
    DOCKER_USERNAME="your-dockerhub-username"
    
    echo -e "${YELLOW}[1/4] Building and tagging image...${NC}"
    docker build -t ${DOCKER_USERNAME}/${APP_NAME}:latest .
    
    echo -e "${YELLOW}[2/4] Pushing to Docker Hub...${NC}"
    docker login
    docker push ${DOCKER_USERNAME}/${APP_NAME}:latest
    
    echo -e "${YELLOW}[3/4] Pulling on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker pull ${DOCKER_USERNAME}/${APP_NAME}:latest"
    
    echo -e "${YELLOW}[4/4] Running container on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker stop $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker rm $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker run -d -p ${PORT}:${PORT} --name $CONTAINER_NAME --restart unless-stopped ${DOCKER_USERNAME}/${APP_NAME}:latest"
    
    echo -e "${GREEN}✓ Deployment completed!${NC}"
    echo -e "Access your app at: http://${VPS_IP}:${PORT}"
}

# ========================================
# PHƯƠNG PHÁP 3: Build trên VPS
# ========================================
deploy_build_on_vps() {
    echo -e "${YELLOW}[1/3] Uploading source code to VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "mkdir -p /home/${VPS_USER}/${APP_NAME}"
    scp -r ./* ${VPS_USER}@${VPS_IP}:/home/${VPS_USER}/${APP_NAME}/
    
    echo -e "${YELLOW}[2/3] Building on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "cd /home/${VPS_USER}/${APP_NAME} && docker build -t $IMAGE_NAME ."
    
    echo -e "${YELLOW}[3/3] Running container on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker stop $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker rm $CONTAINER_NAME 2>/dev/null || true"
    ssh ${VPS_USER}@${VPS_IP} "docker run -d -p ${PORT}:${PORT} --name $CONTAINER_NAME --restart unless-stopped $IMAGE_NAME"
    
    echo -e "${GREEN}✓ Deployment completed!${NC}"
    echo -e "Access your app at: http://${VPS_IP}:${PORT}"
}

# ========================================
# PHƯƠNG PHÁP 4: Docker Compose
# ========================================
deploy_compose() {
    echo -e "${YELLOW}[1/2] Uploading source code and compose file...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "mkdir -p /home/${VPS_USER}/${APP_NAME}"
    scp -r ./* ${VPS_USER}@${VPS_IP}:/home/${VPS_USER}/${APP_NAME}/
    
    echo -e "${YELLOW}[2/2] Running docker-compose on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "cd /home/${VPS_USER}/${APP_NAME} && docker-compose down && docker-compose up -d --build"
    
    echo -e "${GREEN}✓ Deployment completed!${NC}"
    echo -e "Access your app at: http://${VPS_IP}:${PORT}"
}

# ========================================
# Utility Functions
# ========================================
check_vps() {
    echo -e "${YELLOW}Checking VPS status...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker ps"
}

logs_vps() {
    echo -e "${YELLOW}Fetching logs from VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker logs -f $CONTAINER_NAME"
}

stop_vps() {
    echo -e "${YELLOW}Stopping container on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker stop $CONTAINER_NAME"
}

restart_vps() {
    echo -e "${YELLOW}Restarting container on VPS...${NC}"
    ssh ${VPS_USER}@${VPS_IP} "docker restart $CONTAINER_NAME"
}

# ========================================
# Main Menu
# ========================================
echo "Chọn phương pháp deploy:"
echo "1) Export/Import (Phù hợp cho image nhỏ)"
echo "2) Docker Hub (Khuyên dùng)"
echo "3) Build trên VPS (Tốt nhất cho production)"
echo "4) Docker Compose (Tốt nhất cho multi-service)"
echo "5) Check VPS status"
echo "6) View logs"
echo "7) Stop container"
echo "8) Restart container"
echo "0) Exit"
echo ""
read -p "Nhập lựa chọn [0-8]: " choice

case $choice in
    1)
        deploy_export_import
        ;;
    2)
        deploy_docker_hub
        ;;
    3)
        deploy_build_on_vps
        ;;
    4)
        deploy_compose
        ;;
    5)
        check_vps
        ;;
    6)
        logs_vps
        ;;
    7)
        stop_vps
        ;;
    8)
        restart_vps
        ;;
    0)
        echo -e "${GREEN}Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac
