'use client'

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'
import { Module } from '@/types'

interface InputBarProps {
  module: Module
  onSend: (text: string) => void
  disabled?: boolean
  isLoading?: boolean
  hasMessages?: boolean
  onSpeechStateChange?: (state: 'listening' | 'idle' | 'error', transcript?: string) => void
}

export function InputBar({
  module,
  onSend,
  disabled = false,
  isLoading = false,
  hasMessages = false,
  onSpeechStateChange,
}: InputBarProps) {
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize Speech Recognition
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'hi-IN' // Hindi / Hinglish voice matching

        recognition.onstart = () => {
          setIsListening(true)
          if (onSpeechStateChange) onSpeechStateChange('listening')
        }

        recognition.onend = () => {
          setIsListening(false)
          if (onSpeechStateChange) onSpeechStateChange('idle')
        }

        recognition.onerror = () => {
          setIsListening(false)
          if (onSpeechStateChange) onSpeechStateChange('error')
        }

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          if (transcript) {
            setText((prev) => {
              const updated = prev ? `${prev} ${transcript}` : transcript
              // Trigger auto-resize after appending speech text
              setTimeout(handleInput, 50);
              return updated
            })
            if (onSpeechStateChange) onSpeechStateChange('idle', transcript)
          }
        }

        recognitionRef.current = recognition
      }
    }
  }, [onSpeechStateChange])

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Aapke browser mein voice typing support nahi hai. Google Chrome use karein.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch {
        // Recognition already started or starting
      }
    }
  }

  const canSend = text.trim().length > 0 && !disabled && !isLoading
  const hasVoiceSupport = mounted && typeof window !== 'undefined' && 
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition)

  return (
    <div className="input-bar-wrapper">
      <div
        className="input-bar transition-all duration-300"
        style={{
          boxShadow: isFocused
            ? `0 0 0 2px ${module.color}, 0 8px 32px rgba(0,0,0,0.12)`
            : isListening
            ? '0 0 0 2px #EF4444, 0 8px 32px rgba(239, 68, 68, 0.2)'
            : text
            ? `0 0 0 2px ${module.color}40, 0 4px 16px rgba(0,0,0,0.06)`
            : '0 4px 16px rgba(0,0,0,0.04)',
        }}
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
          placeholder={
            isListening
              ? 'Bolna shuru karein (Awaaz sun rahe hain…)'
              : `${module.name} se poochein… (Enter to send)`
          }
          disabled={disabled || isListening}
          maxLength={1000}
          rows={1}
          className="input-textarea"
          aria-label="Chat input"
          aria-describedby="input-hint"
        />

        <div className="input-actions">
          {hasVoiceSupport && (
            <motion.button
              type="button"
              onClick={toggleListening}
              className={`input-mic-btn ${isListening ? 'listening-active' : ''}`}
              animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={isListening ? { repeat: Infinity, duration: 1.2 } : {}}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              style={{
                color: isListening ? '#EF4444' : '#64748B',
                cursor: 'pointer',
                opacity: 1,
              }}
              title={isListening ? 'Stop voice typing' : 'Voice typing in Hindi'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </motion.button>
          )}

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
        {text.length > 100 && (
          <span className="character-counter text-gray-500 font-mono ml-auto">
            {text.length} / 1000
          </span>
        )}
      </div>
    </div>
  )
}
