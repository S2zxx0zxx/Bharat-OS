'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TypingIndicatorProps {
  readonly moduleColor: string
}

export function TypingIndicator({ moduleColor }: Readonly<TypingIndicatorProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="flex items-end gap-2 mb-3"
    >
      <div className="typing-bubble">
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="typing-dot"
            style={{ backgroundColor: moduleColor, '--delay': `${delay}ms` } as React.CSSProperties}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
        AI soch raha hai…
      </span>
    </motion.div>
  )
}
