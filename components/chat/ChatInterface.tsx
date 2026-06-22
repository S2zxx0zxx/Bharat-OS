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

function getLanguageLabel(l: 'hi' | 'en' | 'hin'): string {
  if (l === 'hi') return 'हिं'
  if (l === 'en') return 'EN'
  return 'Hin'
}

const translations = {
  hi: {
    welcomeSubtitle: (moduleName: string) => `नमस्ते! मैं आपका ${moduleName} असिस्टेंट हूँ। कोई भी सवाल हिंदी में पूछें।`,
    quotaTitle: "आज की सीमा समाप्त हो गई",
    quotaSub: "10 मुफ्त सवाल प्रतिदिन। कल वापस आएं या प्रो प्लान में अपग्रेड करें।",
    thinking: "एआई सोच रहा है...",
    listening: "आवाज़ सुन रहे हैं...",
    voiceError: "आवाज़ समझ नहीं आई",
    apiActive: (moduleName: string) => `${moduleName} सक्रिय`,
  },
  en: {
    welcomeSubtitle: (moduleName: string) => `Hello! I am your ${moduleName} assistant. Feel free to ask any question in English.`,
    quotaTitle: "Daily Limit Exceeded",
    quotaSub: "10 free questions/day. Please return tomorrow or upgrade to Pro.",
    thinking: "AI is thinking...",
    listening: "Listening to voice...",
    voiceError: "Could not understand voice",
    apiActive: (moduleName: string) => `${moduleName} Active`,
  },
  hin: {
    welcomeSubtitle: (moduleName: string) => `Namaste! Main aapka ${moduleName} assistant hoon. Koi bhi sawaal Hindi/Hinglish mein poochein.`,
    quotaTitle: "Aaj ki limit khatam ho gayi",
    quotaSub: "10 free sawaal/din. Kal wapas aao ya Pro plan upgrade karein.",
    thinking: "AI soch raha hai...",
    listening: "Awaaz sun rahe hain...",
    voiceError: "Awaaz samajh nahi aayi",
    apiActive: (moduleName: string) => `${moduleName} Active`,
  }
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

  // Upgraded States for Phase 3 Component 1
  const [ambientColor, setAmbientColor] = useState('#7C3AED')
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState<'hi' | 'en' | 'hin'>('hi')
  const recognitionRef = useRef<any>(null)

  // Dynamic Island State
  const [islandState, setIslandState] = useState<{
    type: 'idle' | 'listening' | 'redacted' | 'warning' | 'error' | 'thinking'
    message: string
    emoji: string
  }>({
    type: 'idle',
    message: translations['hi'].apiActive(activeModule.name),
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

  // Handle island state updates for active module, language, and loading transitions
  useEffect(() => {
    const t = translations[language]
    if (isLoading) {
      setIslandState({
        type: 'thinking',
        message: t.thinking,
        emoji: '⚡',
      })
    } else {
      setIslandState({
        type: 'idle',
        message: t.apiActive(activeModule.name),
        emoji: activeModule.emoji,
      })
    }
  }, [activeModule, language, isLoading])

  const handleSend = useCallback(
    async (text: string) => {
      if (isExceeded) return

      // Client-side PII check to trigger Dynamic Island alert
      const secCheck = securityCheck(text)
      if (secCheck.hasPII) {
        setIslandState({
          type: 'redacted',
          message: 'Privacy Secured: PII Redacted!',
          emoji: '🔒',
        })
        // Return island to active module state after 4.5 seconds
        setTimeout(() => {
          setIslandState({
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
      const mod = allModules.find((m) => m.id === id)
      if (mod) setAmbientColor(mod.color)
    },
    [switchModule, clearMessages, allModules]
  )

  const handleVoiceInput = useCallback(() => {
    if (globalThis.window === undefined) return
    const SpeechRecognitionAPI =
      (globalThis.window as any).SpeechRecognition || (globalThis.window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert('Aapka browser voice input support nahi karta')
      return
    }
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => {
      setIsRecording(true)
      setIslandState({
        type: 'listening',
        message: translations[language].listening,
        emoji: '🎤',
      })
    }
    recognition.onend = () => {
      setIsRecording(false)
    }
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      if (transcript.trim()) {
        setIslandState({
          type: 'thinking',
          message: `Suna: "${transcript.substring(0, 20)}..."`,
          emoji: '💬',
        })
        handleSend(transcript.trim())
      }
    }
    recognition.onerror = () => {
      setIsRecording(false)
      setIslandState({
        type: 'error',
        message: translations[language].voiceError,
        emoji: '⚠️',
      })
      setTimeout(() => {
        setIslandState({
          type: 'idle',
          message: translations[language].apiActive(activeModule.name),
          emoji: activeModule.emoji,
        })
      }, 3000)
    }
    recognitionRef.current = recognition
    recognition.start()
  }, [language, handleSend, activeModule])

  const showSuggestions = messages.length === 0 && !isLoading

  return (
    <div className={`chat-root relative overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Ambient background glows for 10x aesthetics */}
      <div
        className="ambient-glow"
        style={{ background: ambientColor }}
        aria-hidden="true"
      />

      <Header
        quota={quota}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        activeModule={activeModule}
        languageToggle={
          <div className="lang-toggle">
            {(['hi', 'en', 'hin'] as const).map((l) => {
              const isActive = language === l
              const btnClass = isActive ? 'lang-btn active' : 'lang-btn'
              return (
                <button
                  key={l}
                  className={btnClass}
                  onClick={() => setLanguage(l)}
                >
                  {getLanguageLabel(l)}
                </button>
              )
            })}
          </div>
        }
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
                {translations[language].welcomeSubtitle(activeModule.name)}
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
                {translations[language].quotaTitle}
              </p>
              <p className="quota-exceeded-sub text-orange-900">
                {translations[language].quotaSub}
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
          onVoiceInput={handleVoiceInput}
          isRecording={isRecording}
          language={language}
        />
      </footer>
    </div>
  )
}
