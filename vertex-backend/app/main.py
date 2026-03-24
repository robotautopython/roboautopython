from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.chat import router as chat_router
from app.api.v1.auth import router as auth_router
from app.api.v1.plans import router as plans_router
from app.api.v1.admin import router as admin_router

app = FastAPI(title="Python Automation AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo rotas
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(plans_router, prefix="/api/plans", tags=["Plans"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
