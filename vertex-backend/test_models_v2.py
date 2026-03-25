import os
import sys
from google import genai
from dotenv import load_dotenv

load_dotenv()

def test():
    api_key = os.getenv("GOOGLE_CLOUD_API_KEY")
    if not api_key:
        print("ERRO: GOOGLE_CLOUD_API_KEY não encontrada no .env")
        return

    print(f"Testando com chave: {api_key[:5]}...{api_key[-5:]}")
    client = genai.Client(api_key=api_key)
    
    print("\nTentando listar modelos...")
    try:
        models = client.models.list()
        for m in models:
            print(f"Modelo: {m.name}")
    except Exception as e:
        print(f"Erro ao listar: {e}")

    print("\nTentando gerar conteúdo simples com gemini-1.5-pro...")
    try:
        resp = client.models.generate_content(model="gemini-1.5-pro", contents="Oi")
        print(f"Sucesso 1.5-pro: {resp.text[:20]}...")
    except Exception as e:
        print(f"Falha 1.5-pro: {e}")

    print("\nTentando gerar conteúdo simples com gemini-1.5-flash...")
    try:
        resp = client.models.generate_content(model="gemini-1.5-flash", contents="Oi")
        print(f"Sucesso 1.5-flash: {resp.text[:20]}...")
    except Exception as e:
        print(f"Falha 1.5-flash: {e}")

if __name__ == "__main__":
    test()
