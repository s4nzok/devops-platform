
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



### Day 39 - Container Debugging and Repository Cleanup

#### Added

- `/proc`-based process inspection workflow for debugging minimal containers without `ps` or `curl`.

#### Fixed

- Removed `app/backend/.venv` from Git tracking — was committed by mistake and bloating the repository. Added `.venv/` to `.gitignore`.

#### Verified

- Backend container health via internal `/health` check (Python, no `curl` needed).
- Frontend and backend network attachment to `novamart-network`, confirming reverse proxy routing is correctly configured.

#### Concepts Learned

- `docker exec` vs `docker attach`
- Debugging trade-offs of minimal/slim container images
- Safely untracking files from Git with `--cached`

### Day 40 — Docker Compose Migration

#### Added

- Created `app/docker-compose.yml` to orchestrate the frontend and backend services.
- Defined `frontend` and `novamart-backend` as Compose services with build contexts pointing to their respective directories.
- Replaced manual `docker network create` and multi-step `docker run` commands with a single `docker compose up -d` workflow.

#### Changed

- Backend service explicitly named `novamart-backend` in Compose to preserve compatibility with the hardcoded `proxy_pass` hostname in the Nginx configuration.

#### Validation

- Validated Compose syntax using `docker compose config` before starting containers.
- Verified both containers reach `Up` status via `docker compose ps`.
- Verified backend health directly: `curl localhost:8000/health` → `{"status":"healthy"}`.
- Verified frontend-to-backend proxying through Compose's default network: `curl localhost:8080/api/health` → `{"status":"healthy"}`.

#### Concepts Learned

- Docker Compose replaces manual network creation with an automatic default network shared by all services.
- Service names function as internal DNS hostnames — matching hardcoded config elsewhere is a hard requirement, not a cosmetic choice.
- YAML indentation is structural, not cosmetic — inconsistent indentation can silently break configuration.
- `docker compose config` validates and resolves the compose file without starting containers, catching errors early.

#### Next

- Environment-variable-based backend configuration
- `.env` files and Compose environment separation (dev/staging/prod)
- Database integration
- Persistent storage

