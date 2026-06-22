'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TypingIndicatorProps {
  readonly moduleColor: string
}

export function TypingIndicator({ moduleColor: _moduleColor }: Readonly<TypingIndicatorProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 mb-4"
    >
      <div className="typing-bubble">
        <span
          className="typing-dot"
          style={{ '--delay': '0ms' } as React.CSSProperties}
        />
        <span
          className="typing-dot"
          style={{ '--delay': '160ms' } as React.CSSProperties}
        />
        <span
          className="typing-dot"
          style={{ '--delay': '320ms' } as React.CSSProperties}
        />
      </div>
      <span className="text-xs text-gray-400 mb-1">AI soch raha hai…</span>
    </motion.div>
  )
}
