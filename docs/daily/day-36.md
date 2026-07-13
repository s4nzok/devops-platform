# Day 36 - Containerize NovaMart Frontend

**Sprint:** Sprint 0 — Project Initialization

**Duration:** ~2 Hours

**Status:** ✅ Completed

**Commit:** `feat(day-36): containerize NovaMart frontend with Nginx`

---

# Objective

Deploy the NovaMart frontend inside a Docker container using Nginx, transforming the KodeKloud practice lab into a real-world DevOps project.

---

# KodeKloud Task

Create a running Docker container named `nginx_3` using the `nginx:alpine` image.

---

# Project Implementation

Instead of only deploying an Nginx container, the following was implemented:

## Frontend

- Created the NovaMart landing page.
- Added CSS styling.
- Added JavaScript interaction.

## Nginx

- Created a custom `nginx.conf`.
- Configured the web root.
- Replaced the default Nginx configuration.

## Docker

- Created a custom Dockerfile.
- Used the official `nginx:alpine` image.
- Removed the default Nginx web page.
- Copied the application into the image.
- Built a custom Docker image.
- Deployed the application as a Docker container.

---

# Concepts Learned

- Dockerfile
- Docker Image
- Docker Container
- Docker Build Context
- Nginx Document Root
- Port Mapping
- `FROM`
- `RUN`
- `COPY`
- `EXPOSE`
- `CMD`

---

# Commands Used

## Build Image

```bash
docker build -t novamart-frontend:v1 .
```

## Run Container

```bash
docker run -d --name novamart-web -p 8080:80 novamart-frontend:v1
```

## Verify Container

```bash
docker ps
```

## Test Application

```bash
curl http://localhost:8080
```

---

# Verification

- Docker image built successfully.
- Docker container started successfully.
- Application accessible on port 8080.
- Custom Nginx configuration loaded successfully.
- Frontend served correctly.

---

# Challenges & Solutions

## Docker Permission Error

### Issue

Permission denied while accessing the Docker daemon.

### Solution

Added the user to the `docker` group and refreshed the shell session.

---

## Understanding Docker COPY

### Issue

Confusion about the destination path inside the Docker image.

### Solution

Learned the difference between:

- Host filesystem
- Docker image filesystem
- Running container filesystem

---

# Outcome

Successfully transformed a simple Docker practice lab into the first working component of the NovaMart DevOps Platform.

---

# Next Steps

- Deploy the application using Docker Compose.
- Continue implementing the Day 37 KodeKloud task.
