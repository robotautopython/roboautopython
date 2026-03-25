import { Bot, History as HistoryIcon, LayoutGrid, Shield, LogOut, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  hasMessages: boolean
  canUndo: boolean
  onReset: () => void
  onUndo: () => void
  onOpenPortfolio: () => void
}

export const Header = ({ hasMessages, canUndo, onReset, onUndo, onOpenPortfolio }: HeaderProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-icon">
          <Bot size={22} />
        </div>
        <div className="hide-mobile">
          <div className="header-title">Robot auto Python</div>
        </div>
        <button className="header-portfolio-btn" onClick={onOpenPortfolio}>
          <LayoutGrid size={14} />
          <span className="hide-mobile">Ver</span> Portfólio
        </button>
      </div>
      <div className="header-right">
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
