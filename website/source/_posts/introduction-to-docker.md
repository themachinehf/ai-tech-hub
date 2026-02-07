---
title: "Introduction to Docker for Developers"
date: 2026-02-07
categories: [tutorial]
tags: [docker, devops, containers]
description: "Learn Docker fundamentals for modern application development"
---

# Introduction to Docker for Developers

Docker has revolutionized how we develop, ship, and run applications. This guide covers essential Docker concepts for developers.

## What is Docker?

Docker is a platform that enables you to package applications into containers—standardized units that contain everything needed to run the software.

### Key Benefits

- **Consistency** - Same environment across development, testing, and production
- **Isolation** - Dependencies don't conflict between applications
- **Portability** - Run anywhere Docker is installed
- **Scalability** - Easy to scale containers horizontally

## Your First Docker Image

### Creating a Dockerfile

```dockerfile
# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### Building and Running

```bash
# Build the image
docker build -t my-app:latest .

# Run the container
docker run -p 8000:8000 my-app:latest
```

## Essential Docker Commands

```bash
# List running containers
docker ps

# Stop a container
docker stop container_id

# View container logs
docker logs container_id

# Execute commands in running container
docker exec -it container_id bash

# Remove unused images
docker image prune -a
```

## Docker Compose for Multi-Container Apps

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
  
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=app

volumes:
  postgres_data:
```

## Best Practices

1. **Use multi-stage builds** - Reduce final image size
2. **Don't run as root** - Create non-root users for security
3. **Use .dockerignore** - Exclude unnecessary files
4. **Tag images properly** - Use meaningful version tags

## Conclusion

Docker simplifies development workflows and ensures consistent deployments. Start using Docker today!

---
*Happy containerizing! 📦*
