from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_CLOUD_API_KEY")
client = genai.Client(api_key=api_key)

print("Listando modelos disponíveis:")
try:
    models = client.models.list()
    for model in models:
        print(f"- {model.name} (V1: {model.supported_generation_methods})")
except Exception as e:
    print(f"Erro ao listar modelos: {e}")
