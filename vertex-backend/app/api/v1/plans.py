from fastapi import APIRouter, Depends, HTTPException, status
from app.api.v1.auth import get_current_user
from app.schemas.plans import PlanRequestCreate, PlanRequestResponse
from app.core.supabase_client import supabase_client
import uuid
from typing import List

router = APIRouter()

PLANS = {
    "start": {"price": 99.00, "interactions": 50},
    "grow": {"price": 199.00, "interactions": 110},
    "premium": {"price": 299.00, "interactions": 200}
}

@router.get("/available", response_model=dict)
def get_available_plans():
    return PLANS

@router.post("/request", response_model=PlanRequestResponse)
def create_plan_request(
    request_in: PlanRequestCreate, 
    current_user: dict = Depends(get_current_user)
):
    if request_in.plan_name not in PLANS:
        raise HTTPException(status_code=400, detail="Plano inválido")
        
    new_request = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "plan_name": request_in.plan_name,
        "status": "pending"
    }
    
    response = supabase_client.table("plan_requests").insert(new_request).execute()
    return response.data[0]

@router.get("/my-requests", response_model=List[PlanRequestResponse])
def get_my_requests(current_user: dict = Depends(get_current_user)):
    response = supabase_client.table("plan_requests").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).execute()
    return response.data
