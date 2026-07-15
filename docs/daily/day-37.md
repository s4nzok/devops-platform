# Day 37 - Containerize NovaMart Backend

## Sprint

Sprint 0 — Project Initialization

## Duration

~2 Hours

## Status

✅ Completed

## Commit

feat(day-37): containerize NovaMart backend with Docker


# Overview

After containerizing the NovaMart frontend using Nginx, the next step was to containerize the backend service.

The backend of NovaMart is built using FastAPI and provides APIs required by the frontend application.

Previously, the backend application was running directly on the Ubuntu server using a Python virtual environment.

In this phase, the application was converted into a Docker container so that:

- The runtime environment becomes consistent
- Dependencies are packaged with the application
- Deployment becomes easier
- The service can be moved between environments without manual setup


# Previous State

Before Docker:

```
Ubuntu Server

Python Environment
        |
        |
FastAPI Application
        |
        |
Uvicorn Server
```

The application depended on the server's local Python installation and configuration.


# New State

After Docker implementation:

```
                  User
                    |
                    |
            Docker Environment
                    |
                    |
        +----------------------+
        | NovaMart Backend     |
        | Docker Container     |
        |                      |
        | FastAPI Application  |
        | Uvicorn Server       |
        | Port: 8000           |
        +----------------------+
```


# Backend Application Structure

Current backend structure:

```
app/backend/

├── Dockerfile
├── requirements.txt
└── app
    └── main.py
```


## Application Components


### main.py

Contains the FastAPI application.

Responsibilities:

- Creates API endpoints
- Handles application requests
- Provides health check endpoint


Available endpoints:

```
GET /

GET /health
```


### requirements.txt

Defines Python dependencies required by the application.

Current dependencies:

```
fastapi
uvicorn
```


# Dockerfile Implementation

The Dockerfile defines how the backend container is created.

Dockerfile responsibilities:

## 1. Select Base Image

```dockerfile
FROM python:3.12-slim
```

Uses a lightweight Python image to reduce container size.


## 2. Set Working Directory

```dockerfile
WORKDIR /app
```

All application operations happen inside `/app`.


## 3. Copy Dependencies

```dockerfile
COPY requirements.txt .
```

Copies dependency file into the container.


## 4. Install Dependencies

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```

Installs required Python packages.


## 5. Copy Application Code

```dockerfile
COPY app/ ./app/
```

Copies backend source code into the container.


## 6. Expose Application Port

```dockerfile
EXPOSE 8000
```

Documents that the application listens on port 8000.


## 7. Start Application

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Starts the FastAPI application using Uvicorn.


# Building Docker Image

Created backend Docker image:

```bash
docker build -t novamart-backend:v0.1.0 .
```


Image created:

```
novamart-backend:v0.1.0
```


# Running Backend Container

Started the backend service:

```bash
docker run -d \
--name novamart-backend \
-p 8000:8000 \
novamart-backend:v0.1.0
```


## Port Mapping

Docker maps:

```
Host Machine

192.168.64.4:8000

        |

        |

Container

8000
```


This allows users outside the container to access the backend API.


# Container Verification


Check running containers:

```bash
docker ps
```


Expected:

```
novamart-backend

STATUS:
Up

PORT:
8000->8000
```


# API Testing


## Root Endpoint

Request:

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


## Health Endpoint

Request:

```bash
curl http://localhost:8000/health
```


Response:

```json
{
    "status": "healthy"
}
```


# External Access Testing

The backend was also tested from the Mac host machine.

Request:

```bash
curl http://192.168.64.4:8000/
```


Successful response confirmed:

- VM networking works
- Docker port mapping works
- Backend service is reachable externally


# Troubleshooting Notes


## Browser Testing Issue

Chrome showed:

```
ERR_ADDRESS_UNREACHABLE
```


However:

- curl from Mac worked
- Safari worked successfully


Conclusion:

The issue was browser-specific and not related to Docker networking.


# Docker Concepts Learned


## Image vs Container

Docker Image:

A blueprint containing application code, dependencies, and configuration.


Docker Container:

A running instance created from an image.


## Port Mapping

Allows external access to services running inside containers.

Example:

```
Host Port 8000

        |

Container Port 8000
```


## Docker Layer Caching

Docker builds images using layers.

Unchanged layers are reused during rebuilds, making builds faster.


# KodeKloud Topics Covered

This implementation combines:

- Day 38: Pull Docker Image
- Day 41: Write a Dockerfile
- Day 43: Docker Ports Mapping
- Day 46: Deploy an App on Docker Containers


# Current NovaMart Architecture


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


# Next Steps

Continue improving NovaMart platform:

1. Docker Exec Operations
2. Docker Networking
3. Docker Compose
4. Connect frontend and backend containers
5. Add database service
6. Prepare application for Kubernetes deployment
