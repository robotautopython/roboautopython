import type { ReactNode } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
}

export interface Suggestion {
  icon: ReactNode
  title: string
  text: string
  prompt: string
}

export interface ApiResponse {
  response: string
}
