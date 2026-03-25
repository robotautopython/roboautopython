import { useState, useEffect, useRef } from 'react'
import type { Message } from '../types'
import { chatService } from '../services/chatService'
import { useAuth } from '../contexts/AuthContext'

export const useChat = () => {
  const { user } = useAuth()
  const storageKey = user ? `chat_history_${user.id}` : null
  
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined' && user) {
      const saved = localStorage.getItem(`chat_history_${user.id}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [prevMessages, setPrevMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined' && user) {
      const saved = localStorage.getItem(`chat_history_prev_${user.id}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Atualiza as mensagens quando o usuário muda (ex: logout/login)
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`chat_history_${user.id}`)
      const savedPrev = localStorage.getItem(`chat_history_prev_${user.id}`)
      setMessages(saved ? JSON.parse(saved) : [])
      setPrevMessages(savedPrev ? JSON.parse(savedPrev) : [])
    } else {
      setMessages([])
      setPrevMessages([])
    }
  }, [user?.id])

  // Salva no localStorage sempre que as mensagens mudarem
  useEffect(() => {
    if (storageKey && user) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
      localStorage.setItem(`chat_history_prev_${user.id}`, JSON.stringify(prevMessages))
    }
  }, [messages, prevMessages, storageKey, user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text: string, agentId: string = "automation-expert", image?: File) => {
    if ((!text.trim() && !image) || isLoading) return
    
    setError(null)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      imageUrl: image ? URL.createObjectURL(image) : undefined,
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const data = await chatService.sendMessage(text.trim(), agentId, image)
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        agentId: agentId,
        imageGenerated: data.image_base64
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      setError(err.response?.data?.detail || '⚠️ Erro ao conectar com o servidor. Verifique se o backend está rodando.')
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '⚠️ Ocorreu um problema ao processar sua mensagem.',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const resetChat = async () => {
    // Salva a conversa atual como "anterior" antes de resetar
    if (messages.length > 0) {
      setPrevMessages(messages)
    }

    try {
      await chatService.resetChat()
    } catch { /* ignore */ }
    
    setMessages([])
    setError(null)
  }

  const undoReset = () => {
    if (prevMessages.length > 0) {
      const current = [...messages]
      setMessages(prevMessages)
      setPrevMessages(current)
    }
  }

  return {
    messages,
    prevMessages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    undoReset,
    chatEndRef,
  }
}
