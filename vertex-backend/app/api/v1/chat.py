from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import Optional, List, Dict
import base64
from google.genai import types
from app.services.vertex_service import vertex_service
from app.schemas.chat import ChatResponse
from app.agents.registry import get_agent, list_agents
from app.core.permissions import permission_manager
from app.api.v1.auth import get_current_user

router = APIRouter()

from collections import defaultdict

# Histórico por usuário e agente: {(user_id, agent_id): [mensagens]}
histories: Dict[tuple, List] = defaultdict(list)

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    message: str = Form(...),
    agent_id: str = Form("automation-expert"),
    current_user: dict = Depends(get_current_user),
    image: Optional[UploadFile] = File(None),
):
    user_id = current_user["id"]
    history_key = (user_id, agent_id)
    
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
    
    histories[history_key].append(
        types.Content(role="user", parts=parts)
    )
    
    try:
        response_text, response_img = vertex_service.generate_content(
            history=histories[history_key],
            system_instruction=system_instruction,
            agent_id=agent_id
        )
        
        # 3. Registrar uso (apenas se a geração for bem-sucedida)
        permission_manager.track_usage(user_id)
        
        model_parts = [types.Part.from_text(text=response_text)]
        
        histories[history_key].append(
            types.Content(
                role="model",
                parts=model_parts
            )
        )
        return ChatResponse(response=response_text, image_base64=response_img)
    except Exception as e:
        return ChatResponse(response=f"Erro ao gerar resposta: {str(e)}")

@router.get("/agents")
async def list_agents_endpoint():
    return list_agents()

@router.post("/reset")
async def reset_chat(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    # Limpa o histórico de todos os agentes para este usuário
    keys_to_delete = [k for k in histories.keys() if k[0] == user_id]
    for k in keys_to_delete:
        histories[k].clear()
    return {"status": "ok"}
