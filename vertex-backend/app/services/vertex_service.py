from google import genai
from google.genai import types
import base64
import re
from app.core.config import settings

class VertexService:
    def __init__(self):
        pass

    def _get_client(self, is_designer=False):
        api_key = settings.DESIGNER_API_KEY if is_designer else settings.GOOGLE_CLOUD_API_KEY
        if api_key:
            return genai.Client(api_key=api_key)
        return genai.Client(
            vertexai=True, 
            project=settings.VERTEX_AI_PROJECT, 
            location=settings.VERTEX_AI_LOCATION
        )

    def generate_content(self, history: list, system_instruction: str, agent_id: str = "automation-expert"):
        is_designer = agent_id == "designer"
        client = self._get_client(is_designer)
        
        config_args = {
            "system_instruction": [types.Part.from_text(text=system_instruction)],
        }
        
        config = types.GenerateContentConfig(**config_args)
        
        model_id = settings.DESIGNER_MODEL if is_designer else settings.DEFAULT_MODEL
        
        # O histórico já vem do chat.py contendo a última mensagem do usuário na última posição
        response = client.models.generate_content(
            model=model_id,
            contents=history,
            config=config
        )
        
        text_resp = response.text or ""
        img_resp = None
        
        # Lógica HÍBRIDA para o Designer: Detectar comando de imagem
        if is_designer and "[GENERATE_IMAGE:" in text_resp:
            match = re.search(r"\[GENERATE_IMAGE:\s*(.*?)\]", text_resp)
            if match:
                image_prompt = match.group(1).strip()
                # Limpar a tag do texto final para o usuário
                trigger_text = match.group(0)
                text_resp = text_resp.replace(trigger_text, "").strip()
                
                try:
                    # === MOTOR PRINCIPAL: Gemini com geração nativa de imagem (VALIDADO!) ===
                    # Estes modelos foram testados e CONFIRMADOS funcionando.
                    # Usam cota do Gemini (separada do Imagen), resolvendo o erro 429.
                    gemini_image_models = [
                        "gemini-2.5-flash-image",
                        "gemini-3.1-flash-image-preview",
                        "gemini-3-pro-image-preview",
                    ]
                    
                    imagen_resp = None
                    errors_collected = []
                    success = False
                    
                    for model_name in gemini_image_models:
                        try:
                            print(f"DEBUG [V5]: Tentando geração nativa via {model_name}...")
                            imagen_resp = client.models.generate_content(
                                model=model_name,
                                contents=image_prompt,
                                config=types.GenerateContentConfig(
                                    response_modalities=["Image", "Text"]
                                )
                            )
                            if imagen_resp.candidates:
                                for part in imagen_resp.candidates[0].content.parts:
                                    if hasattr(part, 'inline_data') and part.inline_data:
                                        img_resp = base64.b64encode(part.inline_data.data).decode('utf-8')
                                        print(f"DEBUG [V5]: Sucesso com {model_name}!")
                                        success = True
                                        break
                            if success:
                                break
                        except Exception as e:
                            err_msg = str(e)
                            errors_collected.append(f"Gemini({model_name}): {err_msg}")
                            print(f"DEBUG [V5]: Falha em {model_name}: {err_msg}")
                            continue
                    
                    # === MOTOR RESERVA: Imagen (caso Gemini Flash falhe) ===
                    if not success:
                        imagen_models = [
                            "imagen-3.0-generate-002",
                            "imagen-3.0-fast-generate-001",
                            "imagen-4.0-fast-generate-001"
                        ]
                        for model_name in imagen_models:
                            try:
                                print(f"DEBUG [V5]: Fallback Imagen via {model_name}...")
                                imagen_resp = client.models.generate_content(
                                    model=model_name,
                                    contents=image_prompt
                                )
                                if imagen_resp and imagen_resp.candidates:
                                    for part in imagen_resp.candidates[0].content.parts:
                                        if hasattr(part, 'inline_data') and part.inline_data:
                                            img_resp = base64.b64encode(part.inline_data.data).decode('utf-8')
                                            success = True
                                            print(f"DEBUG [V5]: Sucesso com fallback {model_name}!")
                                            break
                                if success:
                                    break
                            except Exception as e:
                                err_msg = str(e)
                                errors_collected.append(f"Imagen({model_name}): {err_msg}")
                                continue
                    
                    if not success:
                        error_report = " | ".join(errors_collected[-3:])
                        raise Exception(f"Todos os motores falharam. {error_report}")
                        
                except Exception as e:
                    print(f"ERROR [V5]: Falha ao gerar imagem: {e}")
                    text_resp += f"\n\n(Aviso V5: {str(e)})"

        return text_resp, img_resp

vertex_service = VertexService()
