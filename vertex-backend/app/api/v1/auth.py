from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.core.supabase_client import supabase_client
from app.core.security import get_password_hash, verify_password, create_access_token
import uuid

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    # Esse mock será substituído na integração de verificar token se for o caso
    # Mas o Supabase já valida os dados se filtrarmos
    # No caso manual python-jose decodificaria.
    from jose import JWTError, jwt
    from app.core.security import SECRET_KEY, ALGORITHM
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessão expirada ou token inválido")

    # Busca no DB
    response = supabase_client.table("users").select("*").eq("id", user_id).execute()
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    
    return response.data[0]

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate):
    # Verifica se email existe
    response = supabase_client.table("users").select("id").eq("email", user_in.email).execute()
    if response.data and len(response.data) > 0:
        raise HTTPException(status_code=400, detail="Este email já está em uso")
    
    # Cria
    hashed_password = get_password_hash(user_in.password)
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user_in.email,
        "name": user_in.name,
        "password_hash": hashed_password,
        "plan": "free",
        "interactions_limit": 0,
        "interactions_used": 0,
        "is_active": True, # Ativo, porém sem limite p/ chat (0 interações)
        "is_admin": False
    }
    
    try:
        res = supabase_client.table("users").insert(new_user).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar usuário: {e}")

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Busca por email
    response = supabase_client.table("users").select("*").eq("email", form_data.username).execute()
    users = response.data
    if not users or len(users) == 0:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    user = users[0]
    
    # Se password_hash não existir (usuário seedado manualmente antes do upgrade da tabela)
    stored_hash = user.get("password_hash")
    if not stored_hash:
        # Permite bypass temporário pros seeds ou proibe
        if user["id"] == "user_123" and form_data.password == "admin123":
            pass # Permite fallback pra debug
        else:
            raise HTTPException(status_code=401, detail="Conta desatualizada. Use o painel admin ou recrie.")
    else:
        if not verify_password(form_data.password, stored_hash):
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
            
    access_token = create_access_token(subject=user["id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
