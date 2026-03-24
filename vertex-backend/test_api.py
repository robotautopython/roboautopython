import requests

url = "http://localhost:8000/api/chat"
data = {
    "message": "Teste rapido de integração",
    "agent_id": "automation-expert",
    "user_id": "user_123"
}
try:
    response = requests.post(url, data=data)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.json())
except Exception as e:
    print("ERROR:", str(e))
