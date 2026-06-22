'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic } from 'lucide-react'
import { Module } from '@/types'

interface InputBarProps {
  module: Module
  onSend: (text: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function InputBar({
  module,
  onSend,
  disabled = false,
  isLoading = false,
}: InputBarProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled || isLoading) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, disabled, isLoading, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
  }

  const canSend = text.trim().length > 0 && !disabled && !isLoading

  return (
    <div className="input-bar-wrapper">
      <div
        className="input-bar"
        style={{
          boxShadow: text
            ? `0 0 0 2px ${module.color}60, 0 4px 24px rgba(0,0,0,0.12)`
            : '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`${module.name} se poochein… (Enter to send)`}
          disabled={disabled}
          rows={1}
          className="input-textarea"
          aria-label="Chat input"
          aria-describedby="input-hint"
        />

        <div className="input-actions">
          <button
            className="input-mic-btn"
            aria-label="Voice input (coming soon)"
            disabled
            title="Voice input coming soon"
          >
            <Mic size={18} />
          </button>

          <AnimatePresence>
            <motion.button
              id="send-button"
              onClick={handleSend}
              disabled={!canSend}
              whileHover={canSend ? { scale: 1.08 } : {}}
              whileTap={canSend ? { scale: 0.93 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="send-button"
              style={{
                background: canSend ? '#FF6B00' : '#D1D5DB',
                cursor: canSend ? 'pointer' : 'not-allowed',
              }}
              aria-label="Send message"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="send-spinner"
                />
              ) : (
                <Send size={18} className="send-icon" />
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      <p id="input-hint" className="input-hint">
        <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
