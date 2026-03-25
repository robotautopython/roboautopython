import axios from 'axios'
import type { ApiResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

// Adiciona interceptor para incluir token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  async sendMessage(message: string, agentId: string = "automation-expert", image?: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('message', message || 'Analise esta imagem e me diga o que você vê.')
    formData.append('agent_id', agentId)
    
    if (image) {
      formData.append('image', image)
    }

    const { data } = await api.post<ApiResponse>('/api/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    
    return data
  },

  async resetChat(): Promise<void> {
    await api.post('/api/reset')
  },

  async getAgents(): Promise<any[]> {
    const { data } = await api.get('/api/agents')
    return data
  }
}

export default api
