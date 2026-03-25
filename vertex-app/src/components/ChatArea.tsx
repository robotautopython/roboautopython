import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import type { Message } from '../types'
import type { RefObject } from 'react'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  chatEndRef: RefObject<HTMLDivElement | null>
  formatMessage: (content: string) => string
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, chatEndRef, formatMessage }) => {
  return (
    <div className="chat-area">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`message-row ${msg.role}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <div className="message-avatar">
              {msg.role === 'assistant' ? (
                <img 
                  src={msg.agentId === 'designer' ? "/designer-logo.png" : "https://ik.imagekit.io/lflb43qwh/MEU%20ROB%C3%94/01d98a63-915e-4e9e-8098-d118cef3e431.psd%20(1).png"} 
                  alt="Assistant Avatar" 
                  className="robot-avatar-img"
                  style={msg.agentId === 'designer' ? { padding: '2px' } : {}}
                />
              ) : (
                <div className="user-avatar-placeholder">
                  <User size={18} />
                </div>
              )}
            </div>
            <div className="message-content-wrap">
              {msg.imageUrl && (
                <div className="message-image-container">
                  <img src={msg.imageUrl} alt="Imagem enviada" className="message-image" />
                </div>
              )}
              
              <div
                className={`message-bubble ${msg.imageGenerated ? 'has-generated-img' : ''}`}
              >
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                
                {msg.imageGenerated && (
                  <motion.div 
                    className="generated-image-container"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <img 
                      src={`data:image/png;base64,${msg.imageGenerated}`} 
                      alt="Logo Gerada" 
                      className="generated-image" 
                    />
                    <div className="img-generation-glow" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <div className="typing-indicator">
          <div className="message-avatar robot-loading-avatar">
             <div className="loading-dot-pulse" />
          </div>
          <div className="typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  )
}
