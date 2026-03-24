from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.error("Credenciais do Supabase não configuradas corretamente no .env")
        raise ValueError("Supabase URL and Key must be provided")
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Instância global reutilizável
supabase_client = get_supabase()
