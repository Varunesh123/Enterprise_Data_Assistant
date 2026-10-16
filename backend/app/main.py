from fastapi import FastAPI
from app.api.v1.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.catalogs import router as catalogs_router
from app.api.v1.schemas import router as schemas_router

app = FastAPI(
    title="Data Catalog Copilot",
    description="AI-powered enterprise data catalog and join assistant",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Application is running!"}

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "data-catalog-copilot-api",
    }
    
app.include_router(
    auth_router,
    prefix="/api/v1"
)
app.include_router(
    catalogs_router,
    prefix="/api/v1"
)
app.include_router(
    schemas_router,
    prefix="/api/v1"
)