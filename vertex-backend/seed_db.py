import os
import sys
from dotenv import load_dotenv

# Garantir que executa no contexto do app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.supabase_client import supabase_client

def seed_admin_user():
    print("Tentando inserir usuário admin na tabela 'users'...")
    try:
        user_data = {
            "id": "user_123",
            "email": "israel@exemplo.com",
            "name": "Israel Souza (Admin)",
            "plan": "premium",
            "interactions_limit": 999999,
            "interactions_used": 0,
            "is_active": True,
            "is_admin": True
        }
        
        # Faz upsert (se existir, atualiza)
        response = supabase_client.table("users").upsert(user_data).execute()
        print(f"Sucesso! Dados inseridos/atualizados: {response.data}")
    except Exception as e:
        print(f"\nERRO: {str(e)}")
        print("\n--- AÇÃO NECESSÁRIA ---")
        print("Você precisa criar a tabela 'users' no Supabase Editor de SQL. Execute:")
        print('''
CREATE TABLE users (
    id text PRIMARY KEY,
    email text UNIQUE NOT NULL,
    name text,
    plan text DEFAULT 'free',
    interactions_limit integer DEFAULT 0,
    interactions_used integer DEFAULT 0,
    is_active boolean DEFAULT false,
    is_admin boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
        ''')

if __name__ == "__main__":
    seed_admin_user()
