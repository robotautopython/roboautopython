from pydantic import BaseModel
from typing import Optional

class UserInteractionsUpdate(BaseModel):
    interactions_limit: int

class RequestStatusUpdate(BaseModel):
    status: str # 'approved' ou 'rejected'
