# -----------------------------------------------------------------------------
# Base Image
# -----------------------------------------------------------------------------
# Start with the official lightweight Python 3.12 image from Docker Hub.
# If this image doesn't exist locally, Docker automatically downloads (pulls) it.
FROM python:3.12-slim

# -----------------------------------------------------------------------------
# Working Directory
# -----------------------------------------------------------------------------
# Set the working directory inside the container.
# All following commands (COPY, RUN, CMD) execute relative to this directory.
WORKDIR /app

# -----------------------------------------------------------------------------
# Copy Dependency File
# -----------------------------------------------------------------------------
# Copy only requirements.txt first.
# This improves Docker build caching because dependencies don't need to be
# reinstalled if only the application code changes.
COPY requirements.txt .

# -----------------------------------------------------------------------------
# Install Python Dependencies
# -----------------------------------------------------------------------------
# Install FastAPI and Uvicorn into the image.
# --no-cache-dir keeps the image smaller by removing pip's download cache.
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------------------------------------------------------
# Copy Application Source Code
# -----------------------------------------------------------------------------
# Copy the application's source code into the container.
# Local folder:   backend/app/
# Container path: /app/app/
COPY app/ ./app/

# -----------------------------------------------------------------------------
# Documentation
# -----------------------------------------------------------------------------
# This tells anyone using the image that the application listens on port 8000.
# NOTE:
# EXPOSE DOES NOT publish the port.
# Port publishing happens later with:
# docker run -p 8000:8000
EXPOSE 8000

# -----------------------------------------------------------------------------
# Default Startup Command
# -----------------------------------------------------------------------------
# When someone runs:
#
#   docker run novamart-backend
#
# Docker automatically executes this command.
#
# This starts the FastAPI application using Uvicorn.
#
# app.main:app
# │    │     │
# │    │     └── FastAPI object named "app"
# │    └──────── main.py
# └───────────── app/ directory
#
# --host 0.0.0.0
# Listen on all network interfaces so Docker can forward requests into
# the container.
#
# --port 8000
# Start the server on port 8000 inside the container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
