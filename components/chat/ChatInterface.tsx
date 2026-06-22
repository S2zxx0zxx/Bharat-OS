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

// ── localStorage hook ─────────────────────────────────────────────
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (globalThis.window === undefined) return defaultValue
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? defaultValue : (JSON.parse(stored) as T)
    } catch {
      return defaultValue
    }
  })

  const setStoredValue: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setValue((prev) => {
        const next =
          typeof action === 'function'
            ? (action as (p: T) => T)(prev)
            : action
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore quota errors
        }
        return next
      })
    },
    [key]
  )

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
  const [darkMode, setDarkMode] = useLocalStorage('bharatos-dark', false)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleSend = useCallback(
    async (text: string) => {
      if (isExceeded) return
      const ok = consumeQuota()
      if (!ok) return
      await sendMessage(text)
    },
    [isExceeded, consumeQuota, sendMessage]
  )

  const handleModuleSwitch = useCallback(
    (id: ModuleId) => {
      switchModule(id)
      clearMessages()
    },
    [switchModule, clearMessages]
  )

  const showSuggestions = messages.length === 0 && !isLoading

  return (
    <div className={`chat-root ${darkMode ? 'dark' : ''}`}>
      <Header
        quota={quota}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      {/* Module tabs */}
      <nav className="module-tabs-nav" aria-label="BharatOS modules">
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

      {/* Welcome banner */}
      <AnimatePresence mode="wait">
        {showSuggestions && (
          <motion.div
            key={`welcome-${activeModuleId}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="welcome-banner"
            style={{
              background: `linear-gradient(135deg, ${activeModule.colorLight}, white)`,
              borderColor: `${activeModule.color}30`,
            }}
          >
            <div className="welcome-emoji" aria-hidden="true">
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
                Namaste! Main aapka {activeModule.name} hoon. Koi bhi sawaal
                poochein.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <main
        id="messages-area"
        className="messages-area"
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
                onClick={clearMessages}
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
            className="quota-exceeded-banner"
          >
            <Lock size={18} />
            <div>
              <p className="quota-exceeded-title">
                Aaj ki limit khatam ho gayi
              </p>
              <p className="quota-exceeded-sub">
                10 free sawaal/din. Kal wapas aao ya Pro plan upgrade karein.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <footer className="input-footer" role="contentinfo">
        <InputBar
          module={activeModule}
          onSend={handleSend}
          disabled={isExceeded || isLoading}
          isLoading={isLoading}
        />
      </footer>
    </div>
  )
}
