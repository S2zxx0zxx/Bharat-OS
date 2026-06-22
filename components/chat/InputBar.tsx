'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'
import { Module } from '@/types'

interface InputBarProps {
  readonly module: Module
  readonly onSend: (text: string) => void
  readonly disabled: boolean
  readonly isLoading: boolean
  readonly onVoiceInput?: () => void
  readonly isRecording?: boolean
  readonly hasMessages?: boolean
}

export function InputBar(props: Readonly<InputBarProps>) {
  const {
    module,
    onSend,
    disabled,
    isLoading,
    onVoiceInput,
    isRecording = false,
    hasMessages = false,
  } = props

  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
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

  const boxShadowStyle = getBoxShadowStyle(isFocused, isRecording, text.length > 0, module.color)
  const counterClass = getCounterClass(text.length)

  const placeholderText = isRecording
    ? 'Bolna shuru karein (Awaaz sun rahe hain…)'
    : `${module.name} se poochein… (Enter to send)`

  return (
    <div className="input-bar-wrapper">
      <div
        className="input-bar transition-all duration-300"
        style={{ boxShadow: boxShadowStyle }}
      >
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          disabled={disabled || isRecording}
          maxLength={1000}
          rows={1}
          className="input-textarea"
          aria-label="Chat input"
          aria-describedby="input-hint"
        />

        <div className="input-actions">
          {text.length > 80 && (
            <span className={`char-counter ${counterClass}`}>
              {text.length}/1000
            </span>
          )}

          <button
            type="button"
            className={isRecording ? 'input-mic-btn recording' : 'input-mic-btn'}
            onClick={onVoiceInput}
            aria-label={isRecording ? 'Recording...' : 'Voice input'}
            title={isRecording ? 'Bol raha hoon...' : 'Bolo apna sawaal'}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
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

      <div className="flex justify-between items-center mt-1.5 px-1 text-xs text-gray-400">
        <div>
          {!hasMessages && (
            <p id="input-hint" className="input-hint" style={{ margin: 0 }}>
              Enter bhejne ke liye · <kbd className="text-[10px] bg-gray-100 dark:bg-gray-800 border px-1 py-0.5 rounded">Shift+Enter</kbd> naya line
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function getBoxShadowStyle(
  isFocused: boolean,
  isRecording: boolean,
  hasText: boolean,
  moduleColor: string
): string {
  if (isFocused) {
    return `0 0 0 2px ${moduleColor}, 0 8px 32px rgba(0,0,0,0.12)`
  }
  if (isRecording) {
    return '0 0 0 2px #EF4444, 0 8px 32px rgba(239, 68, 68, 0.2)'
  }
  if (hasText) {
    return `0 0 0 2px ${moduleColor}40, 0 4px 16px rgba(0,0,0,0.06)`
  }
  return '0 4px 16px rgba(0,0,0,0.04)'
}

function getCounterClass(length: number): string {
  if (length > 400) {
    return 'danger'
  }
  if (length > 250) {
    return 'warning'
  }
  return ''
}
