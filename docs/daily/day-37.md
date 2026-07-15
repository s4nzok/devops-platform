# Day 37 - Containerize NovaMart Backend

## Overview

Today, the NovaMart backend service was containerized using Docker.

The goal was to package the FastAPI application, its dependencies, and runtime environment into a Docker image so the backend can run consistently across different environments.

---

## What Was Implemented

- Created Dockerfile for NovaMart backend
- Built backend Docker image
- Installed application dependencies inside container
- Started FastAPI backend using Docker container
- Configured Docker port mapping
- Verified backend API accessibility

---

## Docker Image Creation

Created backend image:

```bash
docker build -t novamart-backend:v0.1.0 .
```

Generated image:

```
novamart-backend:v0.1.0
```

The image contains:

- Python 3.12 runtime
- FastAPI framework
- Uvicorn server
- NovaMart backend application
- Required Python packages

---

## Running Backend Container

Started the backend container:

```bash
docker run -d \
--name novamart-backend \
-p 8000:8000 \
novamart-backend:v0.1.0
```

Port mapping:

```
Host Port 8000
        |
        |
Container Port 8000
```

This allows external clients to communicate with the backend service running inside the container.

---

## Verification

Checked running containers:

```bash
docker ps
```

Verified backend API:

```bash
curl http://localhost:8000/
```

Response:

```json
{
    "service": "NovaMart Backend",
    "status": "running",
    "version": "0.1.0"
}
```

Health check:

```bash
curl http://localhost:8000/health
```

Response:

```json
{
    "status": "healthy"
}
```

---

## Docker Concepts Learned

### Docker Image

A Docker image is a packaged blueprint containing application code, dependencies, and runtime configuration.

### Docker Container

A container is a running instance of a Docker image.

One image can be used to create multiple containers.

### Docker Port Mapping

Port mapping connects a host machine port with a container port.

Example:

```
Ubuntu Host:8000
        |
        |
Docker Container:8000
```

### Docker Layer Caching

Docker builds images in layers.

If a layer has not changed, Docker reuses it during future builds, reducing build time.

---

## Troubleshooting Notes

During implementation, the application was verified step by step:

- Checked Docker container status
- Verified backend listening port
- Tested API locally using curl
- Tested API access from external machine
- Confirmed Docker networking and port mapping were working correctly

---

## Current NovaMart Architecture

```
                 User
                  |
                  |
          Nginx Frontend Container
             Port 8080
                  |
                  |
           Docker Environment
                  |
                  |
          FastAPI Backend Container
             Port 8000
```

---

## KodeKloud Topics Covered

This implementation combined multiple Docker labs:

- Pull Docker Image
- Write Dockerfile
- Build Docker Image
- Deploy Application on Docker Containers
- Docker Port Mapping

---

## Next Steps

Upcoming NovaMart improvements:

- Docker Exec Operations
- Docker Networking
- Docker Compose
- Connect frontend and backend containers
- Database container integration
- CI/CD automation
