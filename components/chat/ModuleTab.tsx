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
      animate={{ scale: isActive ? 1.05 : 1 }}
      whileHover={{ scale: isActive ? 1.08 : 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`module-tab ${isActive ? 'module-tab-active text-white' : 'module-tab-inactive'}`}
      style={
        isActive
          ? {
              background: `linear-gradient(135deg, ${module.color}, ${module.colorDark})`,
              boxShadow: `0 4px 20px ${module.color}40, 0 2px 8px ${module.color}25`,
              transform: 'translateY(-2px)',
              color: '#FFFFFF',
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
        <span className="module-tab-name" style={{ color: isActive ? '#FFFFFF' : 'inherit' }}>
          {module.name}
        </span>
        <span
          className="module-tab-desc"
          style={{ color: isActive ? 'rgba(255,255,255,0.8)' : module.color }}
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
