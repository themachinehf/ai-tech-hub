---
title: "Docker Best Practices for Production"
date: 2026-02-07 12:00:00
tags: [Docker, DevOps, Production, Best Practices]
categories: DevOps
description: "Master Docker best practices for production environments with security, performance, and maintainability guidelines."
keywords: "Docker, containerization, production, security, best practices"
---

# Docker Best Practices for Production

Docker has become the standard for containerizing applications. This guide covers essential best practices for deploying Docker in production environments.

## Image Optimization

### Use Multi-Stage Builds

Multi-stage builds reduce image size by separating build and runtime environments:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Use Specific Base Image Tags

Avoid using the `latest` tag in production:

```dockerfile
# Good: Specific version
FROM node:20.10.0-alpine3.19

# Bad: Latest tag (unpredictable)
FROM node:latest
```

### Minimize Layers

Each instruction creates a layer. Combine related operations:

```dockerfile
# Good: Combined RUN instructions
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*

# Bad: Multiple RUN instructions
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y ca-certificates
RUN rm -rf /var/lib/apt/lists/*
```

## Security Best Practices

### Run as Non-Root User

```dockerfile
# Create and use non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser
```

### Scan Images for Vulnerabilities

```bash
# Use Trivy for vulnerability scanning
trivy image your-image:tag

# Use Snyk
snyk container test your-image:tag
```

### Use Secret Management

```dockerfile
# Don't hardcode secrets
# Use build arguments for build-time secrets
ARG API_KEY
RUN echo $API_KEY > /app/secret.key

# For runtime secrets, use Docker Swarm secrets or external secrets manager
```

### Enable Docker Content Trust

```bash
export DOCKER_CONTENT_TRUST=1
```

## Health Checks

Add health checks to your containers:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
```

For non-HTTP services:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1
```

## Resource Management

### Set Memory and CPU Limits

```yaml
# docker-compose.yml
services:
  web:
    image: your-app:latest
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Use Appropriate Logging Drivers

```yaml
# docker-compose.yml
services:
  app:
    image: your-app:latest
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"
```

## Networking

### Use Custom Networks

```yaml
services:
  app:
    image: your-app:latest
    networks:
      - app-network
  
  db:
    image: postgres:15
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Configure Health Checks for Service Discovery

```yaml
services:
  app:
    image: your-app:latest
    deploy:
      endpoint_mode: vip
    
  nginx:
    image: nginx:latest
    depends_on:
      - app
```

## Environment Variables

Use environment-specific configurations:

```yaml
# docker-compose.prod.yml
services:
  app:
    image: your-app:${TAG:-latest}
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/app
      - REDIS_URL=redis://cache:6379
    secrets:
      - api-keys
    configs:
      - source: app_config
        target: /app/config.yaml

secrets:
  api-keys:
    file: ./secrets/api-keys.json

configs:
  app_config:
    file: ./config/app.prod.yaml
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Run Trivy Vulnerability Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy Results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

## Monitoring and Logging

### Add Prometheus Metrics

```python
from prometheus_client import Counter, Histogram, start_http_server

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

# Start metrics server
start_http_server(8000)

@app.route('/metrics')
def metrics():
    return generate_latest()
```

### Structured Logging

```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)

logger = structlog.get_logger()
```

## Docker Compose for Production

```yaml
version: '3.8'

services:
  app:
    image: your-app:${IMAGE_TAG:-latest}
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
    environment:
      - NODE_ENV=production
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: overlay
    attachable: true
```

## Checklist for Production Deployment

- [ ] Use multi-stage builds for smaller images
- [ ] Scan images for vulnerabilities
- [ ] Run containers as non-root users
- [ ] Set resource limits (CPU, memory)
- [ ] Add health checks
- [ ] Configure logging drivers
- [ ] Use secrets management
- [ ] Implement monitoring and metrics
- [ ] Set up CI/CD pipeline with security scanning
- [ ] Use specific image tags (not `latest`)
- [ ] Configure proper networking
- [ ] Enable Docker Content Trust
- [ ] Implement graceful shutdown handling

## Conclusion

Following these Docker best practices will help you build secure, efficient, and maintainable containerized applications. Start with the basics and gradually implement more advanced patterns as your deployment complexity grows.
