from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routes import auth, user, wardrobe, recommendations, upload
from fastapi.staticfiles import StaticFiles
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# ✅ CORS Configuration - This is the fix!
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://clothybuddy-m4rgdx72c-yashank-10s-projects.vercel.app/",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(wardrobe.router)
app.include_router(recommendations.router)
app.include_router(upload.router)

# Serve uploaded images
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Fashion Wardrobe API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}