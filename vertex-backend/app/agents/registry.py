from typing import Dict, Any
from app.agents.automation_expert import SYSTEM_INSTRUCTION as AUTOMATION_EXPERT_SI

# Dicionário central de agentes
AGENTS_REGISTRY: Dict[str, Dict[str, Any]] = {
    "automation-expert": {
        "id": "automation-expert",
        "name": "Especialista em Automação Python",
        "description": "Robô focado em criar e debugar automações funcionais com Python.",
        "system_instruction": AUTOMATION_EXPERT_SI,
        "icon": "Bot",
    },
    # Novos agentes podem ser adicionados aqui facilmente
    "business-consultant": {
        "id": "business-consultant",
        "name": "Consultor de Negócios",
        "description": "Especialista em estratégia e faturamento empresarial.",
        "system_instruction": "Você é um consultor de negócios focado em aumentar o faturamento...",
        "icon": "Briefcase",
    }
}

def get_agent(agent_id: str):
    return AGENTS_REGISTRY.get(agent_id, AGENTS_REGISTRY["automation-expert"])

def list_agents():
    return [
        {"id": k, "name": v["name"], "description": v["description"], "icon": v["icon"]} 
        for k, v in AGENTS_REGISTRY.items()
    ]
