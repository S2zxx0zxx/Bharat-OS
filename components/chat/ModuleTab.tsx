'use client'

import { motion } from 'framer-motion'
import { Module, ModuleId } from '@/types'

interface ModuleTabProps {
  readonly module: Module
  readonly isActive: boolean
  readonly onClick: (id: ModuleId) => void
}

export function ModuleTab({ module, isActive, onClick }: Readonly<ModuleTabProps>) {
  return (
    <motion.button
      id={`module-tab-${module.id}`}
      onClick={() => onClick(module.id)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`module-tab ${isActive ? 'module-tab-active' : 'module-tab-inactive'}`}
      style={
        isActive
          ? {
              background: module.gradient,
              boxShadow: `0 4px 20px ${module.color}40, 0 2px 8px ${module.color}30`,
            }
          : {}
      }
      aria-pressed={isActive}
      aria-label={`Switch to ${module.name} — ${module.description}`}
    >
      <span className="module-tab-emoji" role="img" aria-hidden="true">
        {module.emoji}
      </span>
      <span className="module-tab-content">
        <span className="module-tab-name">{module.name}</span>
        <span
          className="module-tab-desc"
          style={{ color: isActive ? 'rgba(255,255,255,0.75)' : module.color }}
        >
          {module.description}
        </span>
      </span>
      {isActive && (
        <motion.span
          layoutId="active-dot"
          className="module-tab-active-dot"
        />
      )}
    </motion.button>
  )
}
