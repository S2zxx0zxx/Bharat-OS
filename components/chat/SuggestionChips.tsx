'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Module } from '@/types'

interface SuggestionChipsProps {
  readonly module: Module
  readonly onSelect: (suggestion: string) => void
  readonly disabled?: boolean
}

export function SuggestionChips({
  module,
  onSelect,
  disabled = false,
}: Readonly<SuggestionChipsProps>) {
  return (
    <div className="suggestions-container">
      <p className="suggestions-label">
        <MessageCircle size={14} />
        <span>Sawaal poochein</span>
      </p>
      <div className="suggestions-grid">
        {module.suggestions.map((suggestion, i) => (
          <motion.button
            key={`${module.id}-${suggestion.slice(0, 30)}`}
            id={`suggestion-${module.id}-${i}`}
            onClick={() => !disabled && onSelect(suggestion)}
            disabled={disabled}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
            whileHover={disabled ? {} : { x: 4, scale: 1.01 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="suggestion-chip"
            style={{
              borderLeftColor: module.color,
            }}
          >
            <span className="suggestion-chip-icon" style={{ color: module.color }}>
              💬
            </span>
            <span className="suggestion-chip-text">{suggestion}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
