from typing import Dict, List, Any, Union
from fastapi import HTTPException, status
from app.core.supabase_client import supabase_client
import logging

logger = logging.getLogger(__name__)

class PermissionManager:
    @staticmethod
    def check_agent_access(user_id: str, agent_id: str):
        try:
            # Busca o usuário no Supabase
            response = supabase_client.table("users").select("*").eq("id", user_id).execute()
            users = response.data
            
            if not users or len(users) == 0:
                raise HTTPException(status_code=401, detail="Usuário não encontrado")
                
            user = users[0]
            
            if not user.get("is_active", False):
                raise HTTPException(status_code=403, detail="Conta inativa. Entre em contato com o suporte.")
            
            # TODO: Futuramente, validar agent_id com plano (Start, Grow, Premium)
            # Por agora, se estiver ativo, está liberado.
            
            current_usage = user.get("interactions_used", 0)
            usage_limit = user.get("interactions_limit", 0)
            
            if current_usage >= usage_limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Limite de interações atingido para este plano."
                )
            
            return True
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao verificar permissão no Supabase: {str(e)}")
            # Se for erro de conexão/tabela inexistente, mocka temporariamente se for o user_123
            if user_id == "user_123":
                logger.warning("Usando fallback de permissão para user_123 devido a erro no DB")
                return True
            raise HTTPException(status_code=500, detail="Erro interno ao verificar permissões")

    @staticmethod
    def track_usage(user_id: str):
        try:
            # Busca o uso atual
            response = supabase_client.table("users").select("interactions_used").eq("id", user_id).execute()
            if response.data and len(response.data) > 0:
                current_usage = response.data[0].get("interactions_used", 0)
                # Incrementa e atualiza
                supabase_client.table("users").update({"interactions_used": current_usage + 1}).eq("id", user_id).execute()
        except Exception as e:
            logger.error(f"Erro ao registrar uso no Supabase: {str(e)}")

permission_manager = PermissionManager()
