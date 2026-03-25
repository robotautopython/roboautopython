import React from 'react' // v2-fix-ref
import { History as HistoryIcon, Shield, LogOut, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Agent } from '../types'
import { AgentTabs } from './AgentTabs'

interface HeaderProps {
  agents: Agent[]
  activeAgentId: string
  onAgentChange: (id: string) => void
  hasMessages: boolean
  canUndo: boolean
  onReset: () => void
  onUndo: () => void
  onOpenPortfolio: () => void
}

export const Header: React.FC<HeaderProps> = ({
  agents,
  activeAgentId,
  onAgentChange,
  hasMessages,
  canUndo,
  onReset,
  onUndo,
  onOpenPortfolio
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0]
  const isDesigner = activeAgentId === 'designer'

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-icon">
          <img
            src={activeAgentId === 'designer' ? "/designer-logo.png" : "/roboauto-logo.png"}
            alt="Logo"
            className="robot-profile-img"
            style={{ padding: activeAgentId === 'designer' ? '8px' : '0' }}
          />
        </div>
        <div className="header-info">
          <h1 className="header-title">{activeAgent?.name || 'Carregando...'}</h1>
          <span className="header-subtitle">{activeAgent?.description || ''}</span>
        </div>
        
        {!hasMessages && (
          <AgentTabs 
            agents={agents}
            activeAgentId={activeAgentId} 
            onChangeAgent={onAgentChange} 
          />
        )}
      </div>
      <div className="header-right">
        {!isDesigner && (
          <button 
            className="header-portfolio-btn" 
            onClick={onOpenPortfolio}
          >
            Portfolio
          </button>
        )}

        {user?.is_admin && (
          <button
            className="header-portfolio-btn admin-btn"
            onClick={() => navigate('/admin')}
            title="Painel Admin"
          >
            <Shield size={14} />
            <span className="hide-mobile">Admin</span>
          </button>
        )}
        
        {canUndo && (
          <button 
            className="header-btn undo-btn" 
            title="Voltar para conversa anterior" 
            onClick={onUndo}
          >
            <HistoryIcon size={18} />
          </button>
        )}

        {hasMessages && (
          <button 
            className="header-btn exit-btn" 
            title="Sair da conversa" 
            onClick={onReset}
          >
            <XCircle size={18} />
          </button>
        )}
        
        <button 
          className="header-btn logout-btn" 
          onClick={handleLogout}
          title="Sair da Conta"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
