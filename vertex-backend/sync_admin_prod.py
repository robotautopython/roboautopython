import os
from supabase import create_client
from dotenv import load_dotenv
import bcrypt
import uuid

# Carrega do .env local (vincule ao de produção se desejar atualizar a nuvem)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Use a SERVICE_ROLE aqui para atualizar sem erro de RLS

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def sync_admin():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Erro: SUPABASE_URL ou SUPABASE_KEY não encontrados no .env")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    email = "admin@robo.com"
    password = "admin123" # Senha desejada
    hashed = get_password_hash(password)
    
    print(f"Atualizando {email} com novo hash...")
    
    # Busca o usuário para garantir que o ID bata
    res = supabase.table("users").select("id").eq("email", email).execute()
    
    if res.data:
        user_id = res.data[0]["id"]
        update_res = supabase.table("users").update({"password_hash": hashed}).eq("id", user_id).execute()
        print(f"Sucesso! Usuario {email} atualizado no banco público.users.")
    else:
        print(f"Usuário {email} não encontrado no banco. Criando novo...")
        new_user = {
            "id": str(uuid.uuid4()),
            "email": email,
            "name": "Admin",
            "password_hash": hashed,
            "plan": "premium",
            "interactions_limit": 99999,
            "interactions_used": 0,
            "is_active": True,
            "is_admin": True
        }
        supabase.table("users").insert(new_user).execute()
        print("Usuário criado com sucesso!")

if __name__ == "__main__":
    sync_admin()
