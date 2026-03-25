from typing import Dict, Any
from app.agents.automation_expert import SYSTEM_INSTRUCTION as AUTOMATION_EXPERT_SI
from app.agents.logo_designer import SYSTEM_INSTRUCTION as LOGO_DESIGNER_SI

# Dicionário central de agentes
AGENTS_REGISTRY: Dict[str, Dict[str, Any]] = {
    "automation-expert": {
        "id": "automation-expert",
        "name": "RoboAuto",
        "description": "Especialista em Automação Inteligente e IA para produtividade.",
        "system_instruction": AUTOMATION_EXPERT_SI,
        "icon": "Bot",
    },
    "designer": {
        "id": "designer",
        "name": "Designer",
        "description": "Criação de marcas, logos e identidade visual premium.",
        "system_instruction": LOGO_DESIGNER_SI,
        "icon": "Palette",
    }
}

def get_agent(agent_id: str):
    return AGENTS_REGISTRY.get(agent_id, AGENTS_REGISTRY["automation-expert"])

def list_agents():
    return [
        {"id": k, "name": v["name"], "description": v["description"], "icon": v["icon"]} 
        for k, v in AGENTS_REGISTRY.items()
    ]
