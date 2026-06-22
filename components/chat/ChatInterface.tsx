'use client'

import { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Lock } from 'lucide-react'
import { ModuleTab } from './ModuleTab'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { SuggestionChips } from './SuggestionChips'
import { InputBar } from './InputBar'
import { Header } from '@/components/layout/Header'
import { useChat } from '@/hooks/useChat'
import { useQuota } from '@/hooks/useQuota'
import { useModule } from '@/hooks/useModule'
import { ModuleId } from '@/types'
import { securityCheck } from '@/lib/security'

// ── localStorage hook (SSR-Safe) ─────────────────────────────────────────────
function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue) // Always start with default
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) setValue(JSON.parse(stored) as T)
    } catch { /* ignore */ }
  }, [key])

  const setStoredValue: Dispatch<SetStateAction<T>> = useCallback((action) => {
    setValue((prev) => {
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action
      if (mounted) {
        try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
      }
      return next
    })
  }, [key, mounted])

  return [value, setStoredValue]
}

// ── ChatInterface ────────────────────────────────────────────────
export function ChatInterface() {
  const { activeModuleId, activeModule, allModules, switchModule } =
    useModule('legal')
  const { messages, isLoading, error, sendMessage, clearMessages } =
    useChat(activeModuleId)
  const { quota, isExceeded, consumeQuota } = useQuota()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastQueryRef = useRef<string>('')
  const [darkMode, setDarkMode] = useLocalStorage('bharatos-dark', false)

  // Dynamic Island State
  const [islandState, setIsNavIslandState] = useState<{
    type: 'idle' | 'listening' | 'redacted' | 'warning' | 'error' | 'thinking'
    message: string
    emoji: string
  }>({
    type: 'idle',
    message: `${activeModule.name} Active`,
    emoji: activeModule.emoji,
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Keep island updated with active module
  useEffect(() => {
    setIsNavIslandState({
      type: 'idle',
      message: `${activeModule.name} Active`,
      emoji: activeModule.emoji,
    })
  }, [activeModule])

  // Handle AI Thinking / loading state in dynamic island
  useEffect(() => {
    if (isLoading) {
      setIsNavIslandState({
        type: 'thinking',
        message: 'AI Soch Raha Hai...',
        emoji: '⚡',
      })
    } else {
      setIsNavIslandState({
        type: 'idle',
        message: `${activeModule.name} Active`,
        emoji: activeModule.emoji,
      })
    }
  }, [isLoading, activeModule])

  const handleSend = useCallback(
    async (text: string) => {
      if (isExceeded) return

      // Client-side PII check to trigger Dynamic Island alert
      const secCheck = securityCheck(text)
      if (secCheck.hasPII) {
        setIsNavIslandState({
          type: 'redacted',
          message: 'Privacy Secured: PII Redacted!',
          emoji: '🔒',
        })
        // Return island to active module state after 4.5 seconds
        setTimeout(() => {
          setIsNavIslandState({
            type: 'idle',
            message: `${activeModule.name} Active`,
            emoji: activeModule.emoji,
          })
        }, 4500)
      }

      const ok = consumeQuota()
      if (!ok) return
      lastQueryRef.current = text
      await sendMessage(text)
    },
    [isExceeded, consumeQuota, sendMessage, activeModule]
  )

  const handleModuleSwitch = useCallback(
    (id: ModuleId) => {
      switchModule(id)
      clearMessages()
    },
    [switchModule, clearMessages]
  )

  const handleSpeechState = useCallback((state: 'listening' | 'idle' | 'error', transcript?: string) => {
    if (state === 'listening') {
      setIsNavIslandState({
        type: 'listening',
        message: 'Awaaz sun rahe hain...',
        emoji: '🎤',
      })
    } else if (state === 'error') {
      setIsNavIslandState({
        type: 'error',
        message: 'Awaaz samajh nahi aayi',
        emoji: '⚠️',
      })
      setTimeout(() => {
        setIsNavIslandState({
          type: 'idle',
          message: `${activeModule.name} Active`,
          emoji: activeModule.emoji,
        })
      }, 3000)
    } else if (state === 'idle') {
      if (transcript) {
        setIsNavIslandState({
          type: 'thinking',
          message: `Suna: "${transcript.substring(0, 20)}..."`,
          emoji: '💬',
        })
      } else {
        setIsNavIslandState({
          type: 'idle',
          message: `${activeModule.name} Active`,
          emoji: activeModule.emoji,
        })
      }
    }
  }, [activeModule])

  const showSuggestions = messages.length === 0 && !isLoading

  return (
    <div className={`chat-root relative overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Ambient background glows for 10x aesthetics */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full blur-[130px] opacity-25 dark:opacity-20 pointer-events-none transition-all duration-700 select-none z-0" 
        style={{ background: activeModule.color }} 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full blur-[130px] opacity-20 dark:opacity-15 pointer-events-none transition-all duration-700 select-none z-0" 
        style={{ background: activeModule.color }} 
      />

      <Header
        quota={quota}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        activeModule={activeModule}
      />

      {/* Module tabs */}
      <nav className="module-tabs-nav z-10 relative" aria-label="BharatOS modules">
        <div className="module-tabs-scroll">
          {allModules.map((module) => (
            <ModuleTab
              key={module.id}
              module={module}
              isActive={module.id === activeModuleId}
              onClick={handleModuleSwitch}
            />
          ))}
        </div>
      </nav>

      {/* Dynamic Island Notification Pill */}
      <div className="dynamic-island-wrapper z-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${islandState.type}-${islandState.message}`}
            layoutId="dynamic-island-pill"
            initial={{ scale: 0.85, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`dynamic-island island-${islandState.type}`}
          >
            <span className="island-emoji animate-bounce">{islandState.emoji}</span>
            <span className="island-message">{islandState.message}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Welcome banner */}
      <AnimatePresence mode="wait">
        {showSuggestions && (
          <motion.div
            key={`welcome-${activeModuleId}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="welcome-banner z-10 relative"
            style={{
              background: `linear-gradient(135deg, ${activeModule.colorLight}, white)`,
              borderColor: `${activeModule.color}30`,
            }}
          >
            <div className="welcome-emoji animate-pulse" aria-hidden="true">
              {activeModule.emoji}
            </div>
            <div>
              <h1
                className="welcome-title"
                style={{ color: activeModule.color }}
              >
                {activeModule.name} — {activeModule.description}
              </h1>
              <p className="welcome-subtitle">
                Namaste! Main aapka {activeModule.name} assistant hoon. Koi bhi sawaal Hindi/Hinglish mein poochein.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <main
        id="messages-area"
        className="messages-area z-10 relative"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <AnimatePresence>
          {messages.map((message) =>
            message.isLoading ? null : (
              <MessageBubble key={message.id} message={message} />
            )
          )}

          {isLoading && (
            <TypingIndicator key="typing" moduleColor={activeModule.color} />
          )}
        </AnimatePresence>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="error-banner"
              role="alert"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
              <button
                onClick={() => lastQueryRef.current && handleSend(lastQueryRef.current)}
                className="error-retry-btn"
                aria-label="Retry"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            key={`suggestions-${activeModuleId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 relative"
          >
            <SuggestionChips
              module={activeModule}
              onSelect={handleSend}
              disabled={isExceeded}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quota exceeded banner */}
      <AnimatePresence>
        {isExceeded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="quota-exceeded-banner z-10 relative"
          >
            <Lock size={18} className="text-orange-600" />
            <div>
              <p className="quota-exceeded-title text-orange-950 font-bold">
                Aaj ki limit khatam ho gayi
              </p>
              <p className="quota-exceeded-sub text-orange-900">
                10 free sawaal/din. Kal wapas aao ya Pro plan upgrade karein.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <footer className="input-footer z-10 relative" role="contentinfo">
        <InputBar
          module={activeModule}
          onSend={handleSend}
          disabled={isExceeded || isLoading}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
          onSpeechStateChange={handleSpeechState}
        />
      </footer>
    </div>
  )
}
