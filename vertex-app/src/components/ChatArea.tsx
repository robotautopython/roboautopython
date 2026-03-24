import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import type { Message } from '../types'
import type { RefObject } from 'react'
import { ROBOT_IMAGES } from '../constants'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  chatEndRef: RefObject<HTMLDivElement | null>
  formatMessage: (content: string) => string
}

export const ChatArea = ({ messages, isLoading, chatEndRef, formatMessage }: ChatAreaProps) => {
  return (
    <div className="chat-area">
      <AnimatePresence>
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
                  src={ROBOT_IMAGES[messages.indexOf(msg) % ROBOT_IMAGES.length]} 
                  alt="Robot Assistant" 
                  className="robot-avatar-img"
                />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="message-content-wrap">
              {msg.imageUrl && (
                <div className="message-image-container">
                  <img src={msg.imageUrl} alt="Imagem enviada" className="message-image" />
                </div>
              )}
              <div
                className="message-bubble"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content),
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <div className="typing-indicator">
          <div className="message-avatar robot-loading-avatar">
            <img src={ROBOT_IMAGES[0]} alt="Loading..." className="robot-avatar-img" />
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
