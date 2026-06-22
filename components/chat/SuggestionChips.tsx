'use client'

import { motion } from 'framer-motion'
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
      <p className="suggestions-label flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2.5">
        <span>✨ Ye pooch sakte hain:</span>
      </p>
      <div className="suggestions-grid">
        {module.suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            className="suggestion-chip"
            style={{ borderLeftColor: module.color }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.22, ease: [0, 0, 0.2, 1] }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !disabled && onSelect(suggestion)}
            disabled={disabled}
          >
            <span className="suggestion-chip-icon">💬</span>
            <span className="suggestion-chip-text">{suggestion}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
