# NovaMart Frontend

## Overview

The NovaMart frontend is a static web application served by Nginx inside a Docker container.

## Technologies

- HTML5
- CSS3
- JavaScript
- Nginx
- Docker

## Project Structure

```
frontend/
├── assets/
├── nginx/
├── src/
└── Dockerfile
```

## Build

```bash
docker build -t novamart-frontend:v1 .
```

## Run

```bash
docker run -d --name novamart-web -p 8080:80 novamart-frontend:v1
```

## Access

```
http://localhost:8080
```

or

```
http://<server-ip>:8080
```
