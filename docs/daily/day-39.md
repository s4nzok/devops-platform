# Day 39 - Container Debugging and Repository Hygiene

## Sprint

Sprint 0 — Project Initialization

## Duration

~1 Hour

## Status

✅ Completed

## Overview

Today's session focused on debugging NovaMart containers using `docker exec`,
verifying the frontend-backend network setup with real evidence, and fixing
a repository hygiene issue where the Python virtual environment had been
committed to Git.

## Container Lifecycle Practice

Practiced the difference between starting an existing container versus
creating a new one:

```bash
docker start novamart-backend
```

`docker start` reuses an already-created container. `docker run` would have
created a duplicate container from the image instead.

## Docker Exec Debugging

Used `docker exec` to inspect the running backend container without
stopping it:

```bash
docker exec -it novamart-backend bash
```

### Slim Image Limitations

The backend image (Python slim base) does not include `ps` or `curl`.
Verified running processes using the kernel's `/proc` filesystem instead:

```bash
cat /proc/1/status
```

Confirmed Uvicorn runs as PID 1, as root (`Uid: 0`), with 5 threads.

Verified the health endpoint using Python directly, since `curl` was
unavailable:

```bash
python3 -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"
```

Response:

```json
{"status": "healthy"}
```

## Configuration Review

Inspected `app/main.py` and confirmed the backend currently has no
environment-variable-based configuration — all values (title, version)
are hardcoded. Flagged as a future improvement once the app needs
per-environment config (dev/staging/prod) or secrets.

## Network Verification

Re-verified, with direct evidence rather than assumption, that both
containers are attached to the custom bridge network:

```bash
docker inspect novamart-web --format '{{.NetworkSettings.Networks}}'
docker inspect novamart-backend --format '{{.NetworkSettings.Networks}}'
```

Both confirmed on `novamart-network`, matching the Nginx `proxy_pass`
configuration to `http://novamart-backend:8000/`.

## Repository Hygiene Fix

Discovered that `app/backend/.venv/` (the Python virtual environment) had
been committed to Git history, despite not being listed in `.gitignore`.

Fixed by:

```bash
echo ".venv/" >> .gitignore
git rm -r --cached app/backend/.venv
git add .gitignore
git commit -m "chore: remove .venv from git tracking and update .gitignore"
git push origin main
```

`--cached` was used specifically to untrack the files from Git without
deleting them from disk, since a virtual environment is regenerable and
machine-specific and should never live in version control.

## Concepts Learned

### docker exec vs docker attach

`exec` starts a new process inside a container's namespace and is safe to
exit. `attach` connects directly to the container's main (PID 1) process
and can kill the container if exited carelessly.

### /proc filesystem

Linux exposes live process and kernel information through `/proc`, usable
even when tools like `ps` aren't installed.

### Minimal image trade-offs

Slim/minimal images reduce size and attack surface but limit available
debugging tools inside the container.

### Git tracked vs untracked files

Files already committed stay tracked even after being added to
`.gitignore`; removing them requires `git rm --cached`.

## Validation

* Backend container started and confirmed `Up`
* Backend process confirmed healthy via `/proc` and Python request
* Frontend and backend confirmed on the same Docker network
* `.venv` removed from Git tracking, local files preserved
* Change committed and pushed to `origin/main`

## Next Steps

* Add environment-variable-based configuration to the backend before
  introducing per-environment settings or secrets
* Continue toward Docker Compose to manage the full stack from a single
  configuration file
