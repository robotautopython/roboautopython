import os
import sys
from dotenv import load_dotenv

# Forçar o carregamento do .env local explicitamente
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.config import settings
from supabase import create_client

print("URL:", settings.SUPABASE_URL)
print("KEY:", settings.SUPABASE_KEY[:10] + "...")

client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
try:
    response = client.table("users").select("*").execute()
    print("USERS:", response.data)
except Exception as e:
    print("ERRO SUPABASE:", e)
