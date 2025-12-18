"""
main.py - FastAPI Application Entry Point
LifeOS Backend API with CORS support for Vue.js frontend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
# ROOT ENDPOINT
# ============================================
@app.get("/", tags=["Root"])
async def root():
    """API health check endpoint"""
    return {
        "message": "Welcome to LifeOS API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """Health check for deployment monitoring"""
    return {"status": "healthy"}


# ============================================
# RUN WITH UVICORN
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
