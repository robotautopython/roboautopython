import React from 'react'
import { Bot, Palette, Briefcase } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Agent } from '../types'
import './AgentTabs.css'

const iconMap: Record<string, LucideIcon> = {
  'Bot': Bot,
  'Palette': Palette,
  'Briefcase': Briefcase
}

interface AgentTabsProps {
  agents: Agent[]
  activeAgentId: string
  onChangeAgent: (id: string) => void
}

export const AgentTabs: React.FC<AgentTabsProps> = ({ agents = [], activeAgentId, onChangeAgent }) => {
  if (!agents || agents.length === 0) return null

  return (
    <div className="agent-tabs-container">
      {agents.map((agent) => {
        const Icon = iconMap[agent.icon] || Bot
        const isActive = activeAgentId === agent.id
        
        return (
          <button 
            key={agent.id}
            className={`agent-tab ${isActive ? (agent.id === 'designer' ? 'active-designer' : 'active-automation') : ''}`}
            onClick={() => onChangeAgent(agent.id)}
          >
            <Icon size={18} />
            <span>{agent.name}</span>
          </button>
        )
      })}
    </div>
  )
}
