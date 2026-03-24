from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.api.v1.auth import get_current_user
from app.schemas.auth import UserResponse
from app.schemas.plans import PlanRequestResponse
from app.schemas.admin import UserInteractionsUpdate, RequestStatusUpdate
from app.core.supabase_client import supabase_client
from app.api.v1.plans import PLANS
from datetime import datetime

router = APIRouter()

def admin_required(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado. Apenas administradores.")
    return current_user

@router.get("/requests", response_model=List[PlanRequestResponse])
def get_all_requests(admin: dict = Depends(admin_required)):
    response = supabase_client.table("plan_requests").select("*").order("created_at", desc=True).execute()
    return response.data

@router.post("/requests/{request_id}/approve", response_model=PlanRequestResponse)
def approve_request(request_id: str, admin: dict = Depends(admin_required)):
    # Busca a requisição
    resp_req = supabase_client.table("plan_requests").select("*").eq("id", request_id).execute()
    if not resp_req.data:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    
    req = resp_req.data[0]
    if req["status"] == "approved":
        raise HTTPException(status_code=400, detail="Esta solicitação já foi aprovada")
        
    user_id = req["user_id"]
    plan_name = req["plan_name"]
    
    if plan_name not in PLANS:
        raise HTTPException(status_code=400, detail="Plano desconhecido")
        
    interactions_to_add = PLANS[plan_name]["interactions"]
    
    # Busca usuário para adicionar o limite
    resp_user = supabase_client.table("users").select("interactions_limit").eq("id", user_id).execute()
    if not resp_user.data:
         raise HTTPException(status_code=404, detail="Usuário não encontrado")
         
    current_limit = resp_user.data[0].get("interactions_limit", 0)
    new_limit = current_limit + interactions_to_add
    
    # Atualiza limite de interações e o nome do plano ativo
    supabase_client.table("users").update({
        "interactions_limit": new_limit,
        "plan": plan_name
    }).eq("id", user_id).execute()
    
    # Marca requisição como aprovada
    resp_update = supabase_client.table("plan_requests").update({
        "status": "approved"
    }).eq("id", request_id).execute()
    
    return resp_update.data[0]

@router.post("/requests/{request_id}/reject", response_model=PlanRequestResponse)
def reject_request(request_id: str, admin: dict = Depends(admin_required)):
    # Marca requisição como rejeitada
    resp_update = supabase_client.table("plan_requests").update({
        "status": "rejected"
    }).eq("id", request_id).execute()
    
    if not resp_update.data:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")
    
    return resp_update.data[0]

@router.get("/users", response_model=List[UserResponse])
def get_all_users(admin: dict = Depends(admin_required)):
    response = supabase_client.table("users").select("*").order("created_at", desc=True).execute()
    return response.data

@router.put("/users/{user_id}/interactions", response_model=UserResponse)
def update_user_interactions(user_id: str, update_data: UserInteractionsUpdate, admin: dict = Depends(admin_required)):
    response = supabase_client.table("users").update({"interactions_limit": update_data.interactions_limit}).eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return response.data[0]
