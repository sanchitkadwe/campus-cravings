#!/bin/bash

PROD_ENV_FILE_PATH=~/.campus_cravings/env/.env

# Setup the env variables
set -a
source ${PROD_ENV_FILE_PATH}
set +a

CC_DJANGO_CONTAINER_NAME=campus_cravings_django_prod
CC_DJANGO_DOCKER_IMAGE=campus-cravings-server:latest

# Stop and remove existing container
# docker stop mess_app_server || true
# docker rm mess_app_server || true

# Delete existing image
# docker rmi adityaupadhye/mess-manager-server:latest || true

# echo "Docker cleanup done. Pulling new image from Docker Hub..."

# Pull the latest image from Docker Hub
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker pull adityaupadhye/${CC_DJANGO_DOCKER_IMAGE}


echo "docker pulling new image done."

docker stop ${CC_DJANGO_CONTAINER_NAME} || true
docker rm ${CC_DJANGO_CONTAINER_NAME} || true



# Run the new container
docker run -d \
 -p 8080:8080 \
 --name ${CC_DJANGO_CONTAINER_NAME} \
 --restart unless-stopped \
 --env-file ${PROD_ENV_FILE_PATH} \
 -v ${PROD_ENV_FILE_PATH}:/app/.env \
 adityaupadhye/${CC_DJANGO_DOCKER_IMAGE}

echo "Docker container ${CC_DJANGO_CONTAINER_NAME} up and running..."

# Setup Django crontabs
# docker exec mess_app_server sh -c "python3 manage.py crontab add &"
