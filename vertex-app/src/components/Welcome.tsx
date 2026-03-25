import { motion } from 'framer-motion'
import { Sparkles, Zap, Globe, Table } from 'lucide-react'
import type { Suggestion } from '../types'

const SUGGESTIONS: Suggestion[] = [
  {
    icon: <Sparkles />,
    title: 'Automação de Arquivos',
    text: 'Extraia dados de Notas Fiscais e PDFs para o Excel com IA',
    prompt: 'Quero um robô que use IA para ler dados de notas fiscais em PDF e salvar em uma planilha.',
  },
  {
    icon: <Zap />,
    title: 'WhatsApp Profissional',
    text: 'Crie bots para enviar mensagens e arquivos sem esforço manual',
    prompt: 'Quero criar uma automação para enviar mensagens personalizadas no WhatsApp.',
  },
  {
    icon: <Globe />,
    title: 'Monitoramento Web',
    text: 'Acompanhe preços e concorrentes de forma 100% automática',
    prompt: 'Quero um robô para monitorar preços de produtos em sites de vendas.',
  },
  {
    icon: <Table />,
    title: 'Processos de Dados',
    text: 'Elimine a digitação repetitiva entre diferentes sistemas',
    prompt: 'Preciso de um robô que junte dados de 3 planilhas diferentes e gere um relatório PDF.',
  },
]

interface WelcomeProps {
  onSendSuggestion: (prompt: string) => void
}

export const Welcome = ({ onSendSuggestion }: WelcomeProps) => {
  return (
    <div className="welcome-container">
      <div className="video-background-container">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="hero-video"
          disablePictureInPicture
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      
      <motion.div
        className="welcome-avatar-container"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <div className="neon-wrapper-avatar">
          <div className="welcome-avatar-circle-inner">
            <img 
              src="/roboauto-logo.png" 
              alt="RoboAuto Logo" 
              className="robot-profile-img"
              style={{ padding: '4px' }}
            />
          </div>
        </div>
      </motion.div>
      
      <motion.h1
        className="welcome-title"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        O que você quer automatizar hoje?
      </motion.h1>
      
      <motion.p
        className="welcome-desc"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Eu sou seu especialista em automação inteligente. 
        Transformo tarefas repetitivas em processos instantâneos para que você foque no que realmente importa: <strong>seu tempo</strong>.
      </motion.p>
      
      <motion.div
        className="suggestions-grid"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {SUGGESTIONS.map((s, i) => (
          <div
            key={i}
            className="suggestion-card"
            onClick={() => onSendSuggestion(s.prompt)}
          >
            <div className="suggestion-icon">{s.icon}</div>
            <div>
              <div className="suggestion-title">{s.title}</div>
              <div className="suggestion-text">{s.text}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
