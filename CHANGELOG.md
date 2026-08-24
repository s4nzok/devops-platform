
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Initial project structure

# Changelog

## Sprint 0 — Project Initialization

### Day 36 — Containerize NovaMart Frontend

#### Added

- Created the NovaMart frontend landing page.
- Added CSS styling and JavaScript interaction.
- Configured a custom Nginx server.
- Created a custom Dockerfile using the `nginx:alpine` base image.
- Built the `novamart-frontend:v1` Docker image.
- Deployed the frontend as a Docker container.
- Verified the application from both the host and the browser.

### Day 37 — Containerize NovaMart Backend

#### Added

- Created the NovaMart backend using FastAPI.
- Added `/` and `/health` API endpoints.
- Added Python dependencies using `requirements.txt`.
- Created a backend Dockerfile using `python:3.12-slim`.
- Built the `novamart-backend:v0.1.0` Docker image.
- Deployed the backend as a Docker container.
- Mapped container port `8000` to host port `8000`.
- Verified the backend health endpoint.
- Verified external access from the Mac host.
- Added backend container architecture documentation.

### Day 38 — Docker Networking and Frontend-Backend Integration

#### Added

- Created the `novamart-network` Docker bridge network.
- Connected the frontend and backend containers to the custom network.
- Configured Docker DNS service discovery using `novamart-backend`.
- Configured Nginx as a reverse proxy for `/api/` requests.
- Added frontend-to-backend API communication.
- Updated frontend JavaScript to call `/api/health`.
- Added frontend error handling for backend connection failures.
- Built `novamart-frontend:v1.1` with Nginx reverse proxy support.
- Built `novamart-frontend:v1.2` with frontend API integration.

#### Validation

- Verified `http://localhost:8000/health`.
- Verified `http://localhost:8080/api/health`.
- Verified frontend access from the Mac host.
- Confirmed frontend-to-backend communication through Docker networking.

#### Concepts Learned

- Docker user-defined bridge networks
- Container-to-container communication
- Docker internal DNS
- Nginx reverse proxy
- API routing
- Frontend and backend integration
- Docker port mapping
- VM networking
- Docker image versioning

#### Next

- Docker Compose
- Environment configuration
- Database integration
- Persistent storage
- Complete application stack management
