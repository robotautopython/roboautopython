import { motion } from 'framer-motion'
import { Zap, Database, Code, Palette, Image as ImageIcon, Sparkle } from 'lucide-react'
import type { Agent } from '../types'

interface WelcomeProps {
  agents: Agent[]
  activeAgentId: string
  onSendSuggestion: (prompt: string) => void
  onOpenPortfolio: () => void
}

export const Welcome: React.FC<WelcomeProps> = ({ agents, activeAgentId, onSendSuggestion, onOpenPortfolio }) => {
  const activeAgent = agents.find(a => a.id === activeAgentId)
  const isDesigner = activeAgentId === 'designer'
  
  const suggestions = isDesigner ? [
    { icon: <Palette size={20} />, title: "Criar Logotipo", text: "Design completo de logo premium para sua marca.", prompt: "Olá! Gostaria de iniciar a criação de um Logotipo Profissional para minha marca." },
    { icon: <Sparkle size={20} />, title: "Criativos p/ Ads", text: "Artes persuasivas para anúncios e Instagram.", prompt: "Oi! Preciso criar alguns Criativos para Anúncios (Ads) e Posts de Instagram." },
    { icon: <ImageIcon size={20} />, title: "Publicações", text: "Design para banners, outdoors e materiais impressos.", prompt: "Olá! Gostaria de criar o design para uma Publicação específica (Banner/Outdoor)." },
    { icon: <Zap size={20} />, title: "Identidade Visual", text: "Cores, fontes e manual completo da marca.", prompt: "Oi! Preciso desenvolver a Identidade Visual completa da minha marca." }
  ] : [
    { icon: <Zap size={20} />, title: "Criar Script", text: "Preciso de um script Python para ler dados de um Excel e gerar um PDF.", prompt: "Olá! Preciso de um script Python para ler dados de um Excel e gerar um PDF." },
    { icon: <Database size={20} />, title: "Automação Web", text: "Como posso automatizar o preenchimento de formulários em um site?", prompt: "Como posso automatizar o preenchimento de formulários em um site usando Selenium?" },
    { icon: <Code size={20} />, title: "Debugar Código", text: "Meu script Python está dando erro de conexão, pode me ajudar?", prompt: "Meu script Python está dando erro de conexão, pode me ajudar a debugar?" }
  ]

  return (
    <div className="welcome-container">
      <motion.div 
        className="welcome-avatar-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-avatar-circle">
          <img 
            src={activeAgentId === 'designer' ? "/designer-logo.png" : "/roboauto-logo.png"} 
            alt={activeAgent?.name || "Robot Avatar"} 
            className="robot-profile-img"
            style={activeAgentId === 'designer' ? { padding: '24px', objectFit: 'contain', transform: 'none' } : {}}
          />
        </div>
      </motion.div>

      
      <motion.h1 
        className="welcome-title"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={isDesigner ? { color: 'var(--accent-pink)', WebkitTextFillColor: 'var(--accent-pink)' } : {}}
      >
        {isDesigner ? 'O que vamos criar hoje?' : `O que você quer ${activeAgentId === 'business-consultant' ? 'analisar' : 'automatizar'} hoje?`}
      </motion.h1>
      
      {activeAgentId === 'automation-expert' && (
        <motion.button 
          className="portfolio-trigger-btn"
          onClick={onOpenPortfolio}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Sparkle size={16} />
          Ver Portfólio de Automações
        </motion.button>
      )}
      
      <motion.p 
        className="welcome-desc"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {activeAgent?.description}
      </motion.p>

      <motion.div 
        className="suggestions-grid"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {suggestions.map((s, i) => (
          <div 
            key={i} 
            className="suggestion-card"
            onClick={() => onSendSuggestion(s.prompt)}
          >
            <div className="suggestion-icon">{s.icon}</div>
            <div className="suggestion-info">
              <div className="suggestion-title">{s.title}</div>
              <div className="suggestion-text">{s.text}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
