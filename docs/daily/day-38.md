# Day 38 - Connect NovaMart Frontend and Backend Containers

## Sprint

Sprint 0 — Project Initialization

## Duration

~2 Hours

## Status

✅ Completed

## Overview

Today, the NovaMart frontend and backend containers were connected using a dedicated Docker bridge network.

The frontend runs on Nginx, while the backend runs on FastAPI with Uvicorn.

Nginx was configured as a reverse proxy so that frontend API requests are forwarded internally to the backend container.

This changed NovaMart from two independent containers into a connected multi-container application.

## Docker Network

Created a dedicated Docker network:

```bash
docker network create novamart-network
```

Network configuration:

```text
Name: novamart-network
Driver: bridge
Subnet: 172.18.0.0/16
Gateway: 172.18.0.1
```

Both application containers were connected to the network:

```bash
docker network connect novamart-network novamart-backend
docker network connect novamart-network novamart-web
```

## Container Communication

Docker provides DNS-based service discovery on user-defined bridge networks.

The frontend can communicate with the backend using its container name:

```text
novamart-backend:8000
```

No container IP address is hardcoded.

This allows the backend container IP address to change without requiring changes to the frontend configuration.

## Nginx Reverse Proxy

The Nginx configuration was updated to proxy API requests to the backend:

```nginx
location /api/ {
    proxy_pass http://novamart-backend:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

The request flow is:

```text
Client
  |
  | /api/health
  v
Nginx Frontend
  |
  | novamart-backend:8000
  v
FastAPI Backend
  |
  v
/health
```

## Frontend API Integration

The frontend JavaScript was updated to call:

```javascript
fetch("/api/health")
```

The frontend does not need to know the backend container address.

Nginx handles the internal routing between the frontend and backend.

The JavaScript also handles backend connection failures and displays an appropriate message to the user.

## Frontend Image Versions

After updating the Nginx configuration, a new frontend image was created:

```text
novamart-frontend:v1.1
```

After adding frontend API integration, another image was created:

```text
novamart-frontend:v1.2
```

Version progression:

```text
v1
 |
 +-- Original Nginx frontend
 |
 v
v1.1
 |
 +-- Nginx reverse proxy
 |
 v
v1.2
 |
 +-- Frontend API integration
```

## Running Containers

Final running containers:

```text
novamart-web
Image: novamart-frontend:v1.2
Port: 8080 -> 80

novamart-backend
Image: novamart-backend:v0.1.0
Port: 8000 -> 8000
```

Both containers are connected to:

```text
novamart-network
```

## API Testing

The backend was tested directly:

```bash
curl http://localhost:8000/health
```

Response:

```json
{
    "status": "healthy"
}
```

The Nginx reverse proxy was then tested:

```bash
curl http://localhost:8080/api/health
```

Response:

```json
{
    "status": "healthy"
}
```

This confirmed that Nginx successfully forwarded the request to the FastAPI backend.

## Container-to-Container Testing

Communication from the frontend container to the backend was also verified:

```bash
docker exec -it novamart-web sh
```

Inside the frontend container:

```bash
curl http://novamart-backend:8000/health
```

Response:

```json
{
    "status": "healthy"
}
```

This confirmed that Docker DNS and the custom bridge network were working correctly.

## Browser Testing

The application was accessed from the Mac host using the Ubuntu VM address:

```text
http://192.168.64.4:8080
```

The frontend loaded successfully.

The Explore Project button successfully contacted the backend API and displayed the backend health status.

## Networking Troubleshooting

Initially, the browser was tested using:

```text
http://localhost:8080
```

This resulted in:

```text
ERR_CONNECTION_REFUSED
```

The Docker service was running inside the Ubuntu VM, while the browser was running on the Mac host.

Therefore, localhost referred to the Mac rather than the Ubuntu VM.

Using the VM address resolved the issue:

```text
http://192.168.64.4:8080
```

This demonstrated the difference between host-local addressing and VM networking.

## Current Architecture

```text
                    Mac Browser
                         |
                         |
                  192.168.64.4:8080
                         |
                         v
                +----------------+
                | Nginx Frontend |
                |  novamart-web  |
                |      :80       |
                +-------+--------+
                        |
                     /api/*
                        |
                        v
              +---------------------+
              |  novamart-network   |
              |    Docker Bridge    |
              +----------+----------+
                         |
                         v
                +----------------+
                | FastAPI Backend |
                | novamart-backend|
                |      :8000      |
                +----------------+
```

## Concepts Learned

### User-Defined Docker Networks

A user-defined bridge network allows application containers to communicate with each other.

### Docker DNS

Containers on the same user-defined network can communicate using container names.

Example:

```text
novamart-backend:8000
```

### Reverse Proxy

Nginx receives external requests and forwards API requests to the backend service.

### Service Separation

Frontend and backend remain independently containerized services.

### API Routing

The frontend communicates with the backend through the Nginx reverse proxy instead of directly exposing the backend to the frontend application.

### Port Mapping

External access is provided through:

```text
Host 8080 -> Nginx 80
Host 8000 -> FastAPI 8000
```

## Validation

The following tests were successful:

* Docker network created
* Frontend connected to custom network
* Backend connected to custom network
* Docker DNS resolution confirmed
* Nginx reverse proxy configured
* Backend health endpoint working
* Container-to-container communication working
* Nginx API proxy working
* Frontend API integration working
* Browser access confirmed

## Next Steps

The next major improvement is Docker Compose.

Docker Compose will allow the complete NovaMart application stack to be defined and managed from a single configuration file.

Planned architecture:

```text
compose.yaml
    |
    +---- Frontend
    |
    +---- Backend
    |
    +---- Network
    |
    +---- Future Database
```

Future development will include:

1. Docker Compose
2. Database integration
3. Environment variables
4. Persistent storage
5. Application configuration
6. Health checks
7. Kubernetes deployment
8. CI/CD pipeline
9. Monitoring and observability

