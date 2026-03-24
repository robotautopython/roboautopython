import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Python Automation AI"
    GOOGLE_CLOUD_API_KEY: Optional[str] = os.getenv("GOOGLE_CLOUD_API_KEY")
    VERTEX_AI_PROJECT: str = os.getenv("VERTEX_AI_PROJECT", "project-0113a15a-d091-4764-8bc")
    VERTEX_AI_LOCATION: str = os.getenv("VERTEX_AI_LOCATION", "us-central1")
    DEFAULT_MODEL: str = "gemini-2.5-flash"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "7fd830230f14d9b4b0e5")

settings = Settings()
