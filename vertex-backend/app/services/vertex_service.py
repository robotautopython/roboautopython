from google import genai
from google.genai import types
from app.core.config import settings

class VertexService:
    def __init__(self):
        self._client = self._get_client()

    def _get_client(self):
        if settings.GOOGLE_CLOUD_API_KEY:
            return genai.Client(api_key=settings.GOOGLE_CLOUD_API_KEY)
        return genai.Client(
            vertexai=True, 
            project=settings.VERTEX_AI_PROJECT, 
            location=settings.VERTEX_AI_LOCATION
        )

    def generate_content(self, history: list, system_instruction: str):
        config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            max_output_tokens=8192,
            system_instruction=[types.Part.from_text(text=system_instruction)],
        )
        
        response = self._client.models.generate_content(
            model=settings.DEFAULT_MODEL,
            contents=history,
            config=config,
        )
        return response.text

vertex_service = VertexService()
