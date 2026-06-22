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
      <p className="suggestions-label flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2.5">
        <span>✨ Ye pooch sakte hain:</span>
      </p>
      <div className="suggestions-grid">
        {module.suggestions.map((suggestion, i) => (
          <motion.button
            key={`${module.id}-${suggestion.slice(0, 30)}`}
            id={`suggestion-${module.id}-${i}`}
            onClick={() => !disabled && onSelect(suggestion)}
            disabled={disabled}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={
              disabled
                ? {}
                : {
                    x: 4,
                    borderLeftWidth: '7px',
                    scale: 1.01,
                  }
            }
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="suggestion-chip bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-xl p-4 flex items-start gap-3 text-left w-full cursor-pointer hover:shadow-md transition-shadow"
            style={{
              borderLeftColor: module.color,
              borderLeftWidth: '4px',
              borderLeftStyle: 'solid',
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
