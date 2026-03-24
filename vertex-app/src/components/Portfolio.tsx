import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Mail, FileText, Share2, Zap, Chrome, 
  Globe, BarChart3, Users, DollarSign, 
  MessageCircle, TableProperties, Bell, CheckCircle2, Play
} from 'lucide-react'

interface PortfolioOption {
  title: string
  desc: string
  icon: React.ReactNode
  benefit: string
  prompt: string
}

const OPTIONS: PortfolioOption[] = [
  {
    title: 'Automação de E-mails',
    desc: 'Triagem automática, respostas padronizadas e organização inteligente da caixa de entrada.',
    icon: <Mail className="w-6 h-6" />,
    benefit: 'Menos tarefas manuais no dia a dia',
    prompt: 'Quero automatizar a leitura e resposta de e-mails usando Python e IA.'
  },
  {
    title: 'Leitura de Documentos',
    desc: 'Extração de dados de notas fiscais, contratos e relatórios com apoio de Inteligência Artificial.',
    icon: <FileText className="w-6 h-6" />,
    benefit: 'Transforme papéis em dados utilizáveis',
    prompt: 'Preciso de um robô que leia PDFs e extraia dados automaticamente.'
  },
  {
    title: 'Integração de Sistemas',
    desc: 'Conecte planilhas, ERPs, CRMs e APIs para eliminar o retrabalho e falhas humanas.',
    icon: <Share2 className="w-6 h-6" />,
    benefit: 'Informações sincronizadas sem esforço',
    prompt: 'Quero integrar meu sistema ERP com planilhas Excel automaticamente.'
  },
  {
    title: 'Rotinas Repetitivas',
    desc: 'Automatize cliques, preenchimentos e processos operacionais que drenam sua energia.',
    icon: <Zap className="w-6 h-6" />,
    benefit: 'Ganho real de produtividade',
    prompt: 'Preciso automatizar uma tarefa repetitiva que faço todo dia no computador.'
  },
  {
    title: 'Automação Web',
    desc: 'Robôs que acessam sites, fazem login e executam tarefas complexas automaticamente.',
    icon: <Chrome className="w-6 h-6" />,
    benefit: 'Seu processo rodando sozinho',
    prompt: 'Quero um robô que acesse um site, faça login e execute tarefas automáticas.'
  },
  {
    title: 'Web Scraping Estratégico',
    desc: 'Coleta automática de preços, estoques e informações públicas para inteligência de mercado.',
    icon: <Globe className="w-6 h-6" />,
    benefit: 'Decisões mais rápidas e precisas',
    prompt: 'Quero coletar dados de preços e produtos de sites concorrentes.'
  },
  {
    title: 'Geração de Relatórios',
    desc: 'Consolide dados e gere relatórios automáticos em Excel, PDF ou Dashboards interativos.',
    icon: <BarChart3 className="w-6 h-6" />,
    benefit: 'Relatórios prontos em minutos',
    prompt: 'Preciso automatizar a geração de relatórios mensais em PDF/Excel.'
  },
  {
    title: 'Cadastro em Massa',
    desc: 'Atualize produtos, clientes e registros em grande volume sem precisar digitar nada.',
    icon: <Users className="w-6 h-6" />,
    benefit: 'Escale operações com segurança',
    prompt: 'Quero automatizar o cadastro de centenas de itens no meu sistema.'
  },
  {
    title: 'Automação Financeira',
    desc: 'Conciliação, organização de comprovantes e conferência automática de dados administrativos.',
    icon: <DollarSign className="w-6 h-6" />,
    benefit: 'Mais controle e erro zero',
    prompt: 'Quero automatizar minha conciliação financeira e organização de documentos.'
  },
  {
    title: 'Atendimento Ágil',
    desc: 'Fluxos para WhatsApp e Chats com respostas rápidas, organizadas e 100% contínuas.',
    icon: <MessageCircle className="w-6 h-6" />,
    benefit: 'Atendimento 24/7 sem interrupções',
    prompt: 'Quero criar uma automação para atendimento automático no WhatsApp.'
  },
  {
    title: 'Processamento de Dados',
    desc: 'Limpeza, cruzamento e transformação massiva de dados em planilhas Excel e CSV.',
    icon: <TableProperties className="w-6 h-6" />,
    benefit: 'Dados trabalhados automaticamente',
    prompt: 'Preciso de um script para cruzar dados de várias planilhas diferentes.'
  },
  {
    title: 'Monitoramento & Alertas',
    desc: 'Acompanhe eventos e mudanças em sistemas com notificações automáticas em tempo real.',
    icon: <Bell className="w-6 h-6" />,
    benefit: 'Ação imediata antes do problema',
    prompt: 'Quero ser alertado automaticamente quando ocorrer uma mudança no meu sistema.'
  }
]

const IMPACT_BADGES = [
  'Menos trabalho manual',
  'Mais velocidade operacional',
  'Menos erros',
  'Mais escala',
  'Automações sob medida'
]

interface PortfolioProps {
  isOpen: boolean
  onClose: () => void
  onSelectOption: (prompt: string) => void
}

export const Portfolio = ({ isOpen, onClose, onSelectOption }: PortfolioProps) => {
  const handleSelect = (prompt: string) => {
    onSelectOption(prompt)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="portfolio-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="portfolio-modal"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
          >
            <div className="portfolio-header">
              <div className="portfolio-header-content">
                <h2 className="portfolio-title">Tudo o que sua empresa pode automatizar com Python e IA</h2>
                <p className="portfolio-subtitle">De tarefas repetitivas a operações completas: criamos automações que economizam tempo, reduzem erros e aceleram resultados.</p>
              </div>
              <button className="portfolio-close" onClick={onClose} aria-label="Fechar">
                <X />
              </button>
            </div>

            <div className="portfolio-impact-strip">
              {IMPACT_BADGES.map((badge, i) => (
                <div key={i} className="impact-badge">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  {badge}
                </div>
              ))}
            </div>

            <div className="portfolio-grid">
              {OPTIONS.map((opt, i) => (
                <motion.div 
                  key={i}
                  className="portfolio-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="portfolio-card-icon">
                    {opt.icon}
                  </div>
                  <h3 className="portfolio-card-title">{opt.title}</h3>
                  <p className="portfolio-card-desc">{opt.desc}</p>
                  <div className="portfolio-card-benefit">
                    <Zap className="w-3 h-3" />
                    {opt.benefit}
                  </div>
                  
                  <button 
                    className="portfolio-card-action"
                    onClick={() => handleSelect(opt.prompt)}
                  >
                    <Play size={12} fill="currentColor" />
                    Usar Automação
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="portfolio-footer">
              <h3 className="portfolio-footer-cta">Descreva seu processo e descubra como transformar trabalho manual em automação inteligente.</h3>
              <button className="portfolio-btn-start" onClick={onClose}>
                Solicitar Automação Agora
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
