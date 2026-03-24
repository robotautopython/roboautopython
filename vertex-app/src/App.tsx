import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Welcome } from './components/Welcome'
import { ChatArea } from './components/ChatArea'
import { InputArea } from './components/InputArea'
import { Footer } from './components/Footer'
import { Portfolio } from './components/Portfolio'
import { useChat } from './hooks/useChat'
import { useAuth } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Plans } from './pages/Plans'
import { Admin } from './pages/Admin'

function formatMessage(content: string): string {
  let html = content

  // Code blocks with download buttons (placeholder replaced after render)
  html = html.replace(/```(python|py)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escapedCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${lang}</span>
        <div class="code-block-actions">
          <button class="code-action-btn copy-btn" data-code="${btoa(unescape(encodeURIComponent(code.trim())))}">
            <span class="copy-icon">📋</span> Copiar
          </button>
          <button class="code-action-btn download-btn" data-code="${btoa(unescape(encodeURIComponent(code.trim())))}">
            <span class="download-icon">⬇️</span> Baixar .py
          </button>
        </div>
      </div>
      <pre><code>${escapedCode}</code></pre>
    </div>`
  })

  // Other code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langLabel = lang || 'code'
    return `<div class="code-block-wrapper">
      <div class="code-block-header"><span class="code-lang">${langLabel}</span></div>
      <pre><code>${code.trim()}</code></pre>
    </div>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Section headers
  html = html.replace(/\[([A-ZÁÉÍÓÚÃÕÇ\s]+)\]/g, '<span class="section-header">[$1]</span>')
  // Line breaks
  html = html.replace(/\n/g, '<br/>')

  return html
}

function downloadCode(code: string, filename: string = 'robo.py') {
  const blob = new Blob([code], { type: 'text/x-python' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

function MainChat() {
  const { messages, isLoading, sendMessage, resetChat, chatEndRef, error } = useChat()
  const [showPortfolio, setShowPortfolio] = useState(false)
  const { user } = useAuth()

  // Handle code block button clicks via event delegation
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('.download-btn') as HTMLElement | null
      const copyBtn = target.closest('.copy-btn') as HTMLElement | null

      if (btn) {
        const b64 = btn.getAttribute('data-code')
        if (b64) {
          const code = decodeURIComponent(escape(atob(b64)))
          downloadCode(code)
        }
      }

      if (copyBtn) {
        const b64 = copyBtn.getAttribute('data-code')
        if (b64) {
          const code = decodeURIComponent(escape(atob(b64)))
          copyToClipboard(code).then(() => {
            copyBtn.innerHTML = '<span class="copy-icon">✅</span> Copiado!'
            setTimeout(() => {
              copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copiar'
            }, 2000)
          })
        }
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div className="app-container">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      <Header 
        hasMessages={messages.length > 0} 
        onReset={resetChat} 
        onOpenPortfolio={() => setShowPortfolio(true)}
      />

      {error ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, zIndex: 10, padding: '2rem'
        }}>
          <div style={{ background: 'rgba(255,59,48,0.1)', color: '#ff3b30', padding: '1rem 2rem', borderRadius: '12px', textAlign: 'center' }}>
            {error.includes("Interações esgotadas") || error.includes("Usuário inativo") ? (
              <>
                <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
                <Link to="/plans" style={{ display: 'inline-block', marginTop: '1rem', background: '#ff3b30', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '6px' }}>Solicitar Mais Interações</Link>
              </>
            ) : (
              error
            )}
          </div>
        </div>
      ) : (
        <>
          {messages.length === 0 && !isLoading ? (
            <Welcome onSendSuggestion={(prompt) => sendMessage(prompt)} />
          ) : (
            <ChatArea 
              messages={messages} 
              isLoading={isLoading} 
              chatEndRef={chatEndRef} 
              formatMessage={formatMessage} 
            />
          )}

          <div style={{ zIndex: 10, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', padding: '0.5rem' }}>
            {user ? `${user.interactions_used} / ${user.interactions_limit} interações` : ''}
          </div>
          
          <InputArea onSendMessage={sendMessage} isLoading={isLoading} />
        </>
      )}

      
      <Footer />
      <Portfolio 
        isOpen={showPortfolio} 
        onClose={() => setShowPortfolio(false)} 
        onSelectOption={sendMessage}
      />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff'}}>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><MainChat /></ProtectedRoute>} />
    </Routes>
  )
}
