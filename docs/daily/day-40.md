# Day 40 - Docker Compose Migration

## Sprint

Sprint 0 — Project Initialization

## Duration

~1 Hour

## Status

✅ Completed

## Overview

Today's session replaced the manual, multi-step container startup process
(manual `docker network create` plus separate `docker run` commands for
frontend and backend) with a single `docker-compose.yml` file. The goal
was to understand why Compose exists, how its automatic networking works,
and to migrate NovaMart's existing two-service setup without changing any
application behavior.

## Why Docker Compose

Previously, starting NovaMart required:

```bash
docker network create novamart-network
docker build -t novamart-backend ./backend
docker run -d --name novamart-backend --network novamart-network -p 8000:8000 novamart-backend
docker build -t novamart-frontend ./frontend
docker run -d --name novamart-frontend --network novamart-network -p 8080:80 novamart-frontend
```

Multiple manual steps, easy to run out of order or forget a flag, and not
easily shareable with another engineer in a single reviewable file.
Compose describes the same setup declaratively in one YAML file, brought
up with a single command.

## Reviewing the Existing Setup Before Writing Compose

Before writing `docker-compose.yml`, inspected the actual project files
rather than relying on memory:

* Frontend Dockerfile — `nginx:alpine` base, `EXPOSE 80`, exec-form
  `CMD ["nginx", "-g", "daemon off;"]`
* Backend Dockerfile — `python:3.12-slim` base, `EXPOSE 8000`, exec-form
  `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
* Frontend `nginx.conf` — confirmed the reverse proxy line:

proxy_pass http://novamart-backend:8000/;



This confirmed the backend's Compose service name is not a free choice —
it must be exactly `novamart-backend`, since Compose resolves service
names as internal DNS hostnames, and Nginx already expects that exact
hostname.

## Writing docker-compose.yml

Created `app/docker-compose.yml`:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"

  novamart-backend:
    build: ./backend
    ports:
      - "8000:8000"
```

### Key decisions

* **Frontend service name (`frontend`)** — arbitrary, since nothing in the
  project references frontend by hostname. Only reached from the host via
  the published port.
* **Backend service name (`novamart-backend`)** — locked, since Nginx's
  `proxy_pass` hardcodes this exact hostname.
* **No explicit `networks:` block** — Compose automatically creates a
  shared default network (`app_default`) and attaches every defined
  service to it, removing the need for the manual
  `docker network create` step used previously.

### YAML Indentation Bug

Initially wrote the backend service block with 12+ spaces of indentation
(copy-paste inconsistency) while the frontend block used 4. YAML is
whitespace-structural, not cosmetic — inconsistent indentation can either
throw a parse error or silently misstructure the document. Fixed by using
consistent 2-space steps for every nesting level.

## Validation Before Running

Used `docker compose config` to parse and resolve the file without
starting any containers:

```bash
docker compose config
```

Confirmed:

* Both services correctly attached to `networks.default`
* Backend service resolved as `novamart-backend`
* Port mappings correctly expanded (`target`/`published` matching the
  intended `host:container` mapping)

## Bringing the Stack Up

```bash
docker compose up -d
docker compose ps
```

Both containers reached `Up` status with correct port bindings.

## Functional Verification (Evidence, Not Assumption)

`docker compose ps` showing "Up" was treated as necessary but not
sufficient. Verified actual application behavior:

```bash
curl localhost:8000/health
# {"status":"healthy"}

curl localhost:8080/api/health
# {"status":"healthy"}
```

The second call proves the full chain works: Nginx received the request,
resolved `novamart-backend` via Compose's internal DNS, forwarded the
request, received a response from FastAPI, and returned it unchanged to
the client. An initial `curl -I` (HEAD request) attempt returned
`405 Method Not Allowed` from both endpoints — not a networking failure,
but expected behavior since `/health` only implements `GET`. Confirmed
with a proper `GET` request.

## Concepts Learned

### Compose default networking

Compose automatically creates a project-scoped network and attaches every
defined service to it, replacing manual `docker network create` +
`--network` flags.

### Service names as internal DNS

A Compose service's name is not just a label — other services can resolve
it as a hostname. If existing configuration (like Nginx's `proxy_pass`)
already hardcodes a hostname, the corresponding service name in Compose
is a hard requirement, not a stylistic choice.

### YAML indentation is structural

Unlike most languages, YAML uses whitespace to define parent-child
relationships. Mixed/inconsistent indentation is a real, common bug
source, not just a style nitpick.

### Validate before running

`docker compose config` parses and resolves the file without starting
containers, catching structural errors early and cheaply.

## Validation

* `docker compose config` — valid, correct service/network resolution
* `docker compose ps` — both containers `Up`, correct port bindings
* `curl localhost:8000/health` — `{"status":"healthy"}`
* `curl localhost:8080/api/health` — `{"status":"healthy"}`, confirming
  frontend-to-backend proxying through Compose's network

## Next Steps

* Environment-variable-based backend configuration (flagged since Day 39)
* `.env` files and Compose environment separation (dev/staging/prod)
* Database integration
* Persistent storage
