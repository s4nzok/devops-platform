from fastapi import FastAPI

app = FastAPI(
    title="NovaMart Backend API",
    version="0.1.0",
    description="Backend service for the NovaMart DevOps Platform."
)


@app.get("/")
def root():
    return {
        "service": "NovaMart Backend",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
        }
