from pydantic import BaseModel
from typing import Optional

class ChatResponse(BaseModel):
    response: str
    image_base64: Optional[str] = None
