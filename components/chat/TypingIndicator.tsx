'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TypingIndicatorProps {
  readonly moduleColor: string
}

export function TypingIndicator({ moduleColor }: Readonly<TypingIndicatorProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 mb-4"
    >
      <div className="typing-bubble">
        {[0, 160, 320].map((delay, i) => (
          <motion.span
            key={i}
            className="typing-dot"
            style={{ backgroundColor: moduleColor, '--delay': `${delay}ms` } as React.CSSProperties}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: delay / 1000 }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 mb-1">AI soch raha hai…</span>
    </motion.div>
  )
}
