import sys
import json
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.supabase_client import supabase_client

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
    response = supabase_client.table("users").upsert(user_data).execute()
    print("SUCCESS")
except Exception as e:
    print("ERROR:" + str(e))
