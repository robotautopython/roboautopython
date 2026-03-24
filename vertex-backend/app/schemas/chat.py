from pydantic import BaseModel
from typing import Optional

class ChatResponse(BaseModel):
    response: str
