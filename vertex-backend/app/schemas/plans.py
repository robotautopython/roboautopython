from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlanRequestCreate(BaseModel):
    plan_name: str # 'start', 'grow' ou 'premium'

class PlanRequestResponse(BaseModel):
    id: str
    user_id: str
    plan_name: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]
