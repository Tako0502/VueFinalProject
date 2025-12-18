"""
main.py - FastAPI Application Entry Point
LifeOS Backend API with CORS support for Vue.js frontend
"""
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import HTTPException

from database import engine, Base
from routers import users, tasks, expenses

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title="LifeOS API",
    description="Backend API for LifeOS - Personal Productivity Dashboard for Students",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================
# CORS MIDDLEWARE
# Allows Vue.js frontend to communicate with backend
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # Alternative port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"                           # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# INCLUDE ROUTERS
# ============================================
app.include_router(users.router, tags=["Authentication & Users"])
app.include_router(tasks.router)
app.include_router(expenses.router)


# ============================================
# HEALTH ENDPOINTS
# ============================================
@app.get("/health", tags=["Root"])
async def health_check():
    """Health check for deployment monitoring"""
    return {"status": "healthy"}

# ============================================
# FRONTEND (Vite build) - Static File Serving
# ============================================

FRONTEND_DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"
FRONTEND_INDEX_FILE = FRONTEND_DIST_DIR / "index.html"


@app.get("/", include_in_schema=False)
async def serve_frontend_root():
    """Serve the Vue SPA if built; otherwise show API info."""
    if FRONTEND_INDEX_FILE.exists():
        return FileResponse(FRONTEND_INDEX_FILE)

    return {
        "message": "Welcome to LifeOS API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str):
    """
    SPA fallback for Vue Router (history mode).

    - Serves files from `frontend/dist` when they exist
    - Falls back to `index.html` for client-side routes
    """
    if not FRONTEND_INDEX_FILE.exists():
        raise HTTPException(status_code=404, detail="Not Found")

    requested_path = (FRONTEND_DIST_DIR / full_path).resolve(strict=False)
    dist_root = FRONTEND_DIST_DIR.resolve(strict=False)

    if os.path.commonpath([str(requested_path), str(dist_root)]) != str(dist_root):
        raise HTTPException(status_code=404, detail="Not Found")

    if requested_path.is_file():
        return FileResponse(requested_path)

    return FileResponse(FRONTEND_INDEX_FILE)

# ============================================
# RUN WITH UVICORN
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("RELOAD", "true").lower() == "true"
    )
