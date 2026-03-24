import { Bot, RotateCcw, LayoutGrid, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  hasMessages: boolean
  onReset: () => void
  onOpenPortfolio: () => void
}

export const Header = ({ hasMessages, onReset, onOpenPortfolio }: HeaderProps) => {
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
        <div>
          <div className="header-title">Robot auto Python</div>
        </div>
        <button className="header-portfolio-btn" onClick={onOpenPortfolio}>
          <LayoutGrid size={14} />
          Ver Portfólio
        </button>
      </div>
      <div className="header-right">
        {user?.is_admin && (
          <button 
            className="header-portfolio-btn" 
            onClick={() => navigate('/admin')}
            style={{ borderColor: 'rgba(80, 250, 123, 0.3)', color: '#50fa7b' }}
            title="Acessar o Painel de Administração"
          >
            <Shield size={14} />
            Admin
          </button>
        )}
        <button 
          className="header-portfolio-btn" 
          onClick={handleLogout}
          style={{ borderColor: 'rgba(255, 85, 85, 0.3)', color: '#ff5555' }}
          title="Sair da Conta"
        >
          <LogOut size={14} />
          Sair
        </button>
        {hasMessages && (
          <button 
            className="header-btn" 
            title="Nova conversa" 
            onClick={onReset}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
