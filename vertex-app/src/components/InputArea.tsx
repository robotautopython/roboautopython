import { useState, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent, ClipboardEvent, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Send, X } from 'lucide-react'

interface InputAreaProps {
  onSendMessage: (text: string, image?: File) => void
  isLoading: boolean
}

export const InputArea = ({ onSendMessage, isLoading }: InputAreaProps) => {
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 150) + 'px'
    }
  }

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          setSelectedImage(file)
          const reader = new FileReader()
          reader.onload = (ev) => setImagePreview(ev.target?.result as string)
          reader.readAsDataURL(file)
        }
        return
      }
    }
  }

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    onSendMessage(input, selectedImage || undefined)
    setInput('')
    removeImage()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="input-area">
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            className="image-preview-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="image-preview-thumb">
              <img src={imagePreview} alt="Preview" />
              <button className="image-preview-remove" onClick={removeImage}>
                <X size={14} />
              </button>
            </div>
            <span className="image-preview-name">{selectedImage?.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="neon-wrapper-input">
        <form className="input-wrapper" onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageSelect}
          />
          <button
            type="button"
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Enviar imagem"
          >
            <ImagePlus size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Descreva o que você quer automatizar..."
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            title="Enviar mensagem"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      <div className="input-hint">
        <ImagePlus size={12} /> Envie imagens · <strong>Enter</strong> para enviar · <strong>Shift+Enter</strong> para nova linha
      </div>
    </div>
  )
}
