from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import Optional, List
import base64
from google.genai import types
from app.services.vertex_service import vertex_service
from app.schemas.chat import ChatResponse
from app.agents.registry import get_agent
from app.core.permissions import permission_manager
from app.api.v1.auth import get_current_user

router = APIRouter()

# Histórico em memória
conversation_history: List[types.Content] = []

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    message: str = Form(...),
    agent_id: str = Form("automation-expert"),
    current_user: dict = Depends(get_current_user),
    image: Optional[UploadFile] = File(None),
):
    user_id = current_user["id"]
    
    # 1. Validar permissões e limites
    permission_manager.check_agent_access(user_id, agent_id)
    
    # 2. Obter instruções do agente selecionado
    agent_config = get_agent(agent_id)
    system_instruction = agent_config["system_instruction"]
    
    parts = []
    
    if image:
        image_data = await image.read()
        content_type = image.content_type or "image/png"
        parts.append(types.Part.from_bytes(data=image_data, mime_type=content_type))
    
    parts.append(types.Part.from_text(text=message))
    
    conversation_history.append(
        types.Content(role="user", parts=parts)
    )
    
    try:
        response_text = vertex_service.generate_content(
            history=conversation_history,
            system_instruction=system_instruction
        )
        
        # 3. Registrar uso (apenas se a geração for bem-sucedida)
        permission_manager.track_usage(user_id)
        
        conversation_history.append(
            types.Content(
                role="model",
                parts=[types.Part.from_text(text=response_text)]
            )
        )
        return ChatResponse(response=response_text)
    except Exception as e:
        return ChatResponse(response=f"Erro ao gerar resposta: {str(e)}")

@router.post("/reset")
async def reset_chat():
    conversation_history.clear()
    return {"status": "ok"}
