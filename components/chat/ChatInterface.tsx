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

function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue)
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
    welcomeSubtitle: (n: string) => `नमस्ते! मैं आपका ${n} असिस्टेंट हूँ। कोई भी सवाल हिंदी में पूछें।`,
    quotaTitle: 'आज की सीमा समाप्त हो गई',
    quotaSub: '10 मुफ्त सवाल प्रतिदिन। कल वापस आएं।',
    thinking: 'एआई सोच रहा है...',
    listening: 'आवाज़ सुन रहे हैं...',
    voiceError: 'आवाज़ समझ नहीं आई',
    apiActive: (n: string) => `${n} सक्रिय`,
  },
  en: {
    welcomeSubtitle: (n: string) => `Hello! I am your ${n} assistant. Ask anything in English.`,
    quotaTitle: 'Daily Limit Reached',
    quotaSub: '10 free questions/day. Come back tomorrow.',
    thinking: 'AI is thinking...',
    listening: 'Listening...',
    voiceError: 'Could not understand voice',
    apiActive: (n: string) => `${n} Active`,
  },
  hin: {
    welcomeSubtitle: (n: string) => `Namaste! Main aapka ${n} assistant hoon. Koi bhi sawaal poochein.`,
    quotaTitle: 'Aaj ki limit khatam',
    quotaSub: '10 free sawaal/din. Kal wapas aao.',
    thinking: 'AI soch raha hai...',
    listening: 'Awaaz sun rahe hain...',
    voiceError: 'Awaaz samajh nahi aayi',
    apiActive: (n: string) => `${n} Active`,
  },
}

export function ChatInterface() {
  const { activeModuleId, activeModule, allModules, switchModule } = useModule('legal')
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(activeModuleId)
  const { quota, isExceeded, consumeQuota } = useQuota()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastQueryRef = useRef<string>('')
  const [darkMode, setDarkMode] = useLocalStorage('bharatos-dark', false)
  const [ambientColor, setAmbientColor] = useState('#7C3AED')
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState<'hi' | 'en' | 'hin'>('hi')
  const recognitionRef = useRef<unknown>(null)

  const [islandState, setIslandState] = useState<{
    type: 'idle' | 'listening' | 'redacted' | 'warning' | 'error' | 'thinking'
    message: string
    emoji: string
  }>({
    type: 'idle',
    message: translations['hi'].apiActive(activeModule.name),
    emoji: activeModule.emoji,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const t = translations[language]
    if (isLoading) {
      setIslandState({ type: 'thinking', message: t.thinking, emoji: '⚡' })
    } else {
      setIslandState({ type: 'idle', message: t.apiActive(activeModule.name), emoji: activeModule.emoji })
    }
  }, [activeModule, language, isLoading])

  const handleSend = useCallback(async (text: string) => {
    if (isExceeded) return
    const secCheck = securityCheck(text)
    if (!secCheck.isSafe) {
      setIslandState({ type: 'warning', message: 'Suspicious input blocked!', emoji: '⚠️' })
      setTimeout(() => {
        setIslandState({ type: 'idle', message: translations[language].apiActive(activeModule.name), emoji: activeModule.emoji })
      }, 3000)
      return
    }
    if (secCheck.hasPII) {
      setIslandState({ type: 'redacted', message: 'Privacy Secured: PII Redacted!', emoji: '🔒' })
      setTimeout(() => {
        setIslandState({ type: 'idle', message: translations[language].apiActive(activeModule.name), emoji: activeModule.emoji })
      }, 4500)
    }
    const ok = consumeQuota()
    if (!ok) return
    lastQueryRef.current = secCheck.sanitizedQuery
    await sendMessage(secCheck.sanitizedQuery)
  }, [isExceeded, consumeQuota, sendMessage, activeModule, language])

  const handleModuleSwitch = useCallback((id: ModuleId) => {
    switchModule(id)
    clearMessages()
    const mod = allModules.find((m) => m.id === id)
    if (mod) setAmbientColor(mod.color)
  }, [switchModule, clearMessages, allModules])

  const handleVoiceInput = useCallback(() => {
    if (globalThis.window === undefined) return
    const SpeechRecognitionAPI =
      (globalThis as unknown as Record<string, unknown>).SpeechRecognition ||
      (globalThis as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) { alert('Voice not supported'); return }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as any).abort()
        } catch { /* ignore */ }
      }
      setIsRecording(false)
      setIslandState({
        type: 'idle',
        message: translations[language].apiActive(activeModule.name),
        emoji: activeModule.emoji,
      })
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionAPI as any)()
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => {
      setIsRecording(true)
      setIslandState({ type: 'listening', message: translations[language].listening, emoji: '🎤' })
    }
    recognition.onend   = () => setIsRecording(false)
    recognition.onresult = (event: any) => {
      const t = event.results[0][0].transcript
      if (t.trim()) {
        setIslandState({ type: 'thinking', message: `Suna: "${t.substring(0, 20)}..."`, emoji: '💬' })
        handleSend(t.trim())
      }
    }
    recognition.onerror = () => {
      setIsRecording(false)
      setIslandState({ type: 'error', message: translations[language].voiceError, emoji: '⚠️' })
      setTimeout(() => {
        setIslandState({ type: 'idle', message: translations[language].apiActive(activeModule.name), emoji: activeModule.emoji })
      }, 3000)
    }
    recognitionRef.current = recognition
    recognition.start()
  }, [language, handleSend, activeModule, isRecording])

  const showSuggestions = messages.length === 0 && !isLoading
  const t = translations[language]

  return (
    <div className={`chat-root ${darkMode ? 'dark' : ''}`}>

      {/* ── Ambient glow ── */}
      <div className="ambient-glow" style={{ background: ambientColor }} aria-hidden="true" />

      {/* ── HEADER ── */}
      <Header
        quota={quota}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        activeModule={activeModule}
        languageToggle={
          <div className="lang-toggle">
            {(['hi', 'en', 'hin'] as const).map((l) => (
              <button
                key={l}
                className={language === l ? 'lang-btn active' : 'lang-btn'}
                onClick={() => setLanguage(l)}
                aria-pressed={language === l}
              >
                {getLanguageLabel(l)}
              </button>
            ))}
          </div>
        }
      />

      {/* ── MODULE TABS ── */}
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

      {/* ── DYNAMIC ISLAND ── */}
      <div className="dynamic-island-wrapper" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${islandState.type}-${islandState.message}`}
            initial={{ scale: 0.82, y: -18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.82, y: -18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className={`dynamic-island island-${islandState.type}`}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{islandState.emoji}</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.02em', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {islandState.message}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── MESSAGES AREA — flex:1 fills all remaining height ── */}
      <main id="messages-area" className="messages-area" aria-live="polite" aria-label="Chat messages">

        {/* Welcome banner — inside messages area, no external gap */}
        <AnimatePresence mode="wait">
          {showSuggestions && (
            <motion.div
              key={`welcome-${activeModuleId}`}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.26, ease: [0, 0, 0.2, 1] }}
              className="welcome-banner"
              style={{
                background: `linear-gradient(135deg, ${activeModule.colorLight}, white)`,
                borderColor: `${activeModule.color}30`,
              }}
            >
              <div className="welcome-emoji" aria-hidden="true">{activeModule.emoji}</div>
              <div>
                <h1 className="welcome-title" style={{ color: activeModule.color }}>
                  {activeModule.name} — {activeModule.description}
                </h1>
                <p className="welcome-subtitle">{t.welcomeSubtitle(activeModule.name)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message) =>
            message.isLoading ? null : (
              <MessageBubble key={message.id} message={message} />
            )
          )}
          {isLoading && <TypingIndicator key="typing" moduleColor={activeModule.color} />}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="error-banner" role="alert"
            >
              <AlertCircle size={15} />
              <span>{error}</span>
              <button
                onClick={() => lastQueryRef.current && handleSend(lastQueryRef.current)}
                className="error-retry-btn" aria-label="Retry"
              >
                <RefreshCw size={13} /> Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} style={{ height: '4px' }} />
      </main>

      {/* ── SUGGESTIONS — outside messages area, above footer ── */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            key={`suggestions-${activeModuleId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <SuggestionChips module={activeModule} onSelect={handleSend} disabled={isExceeded} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── QUOTA EXCEEDED ── */}
      <AnimatePresence>
        {isExceeded && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="quota-exceeded-banner"
          >
            <Lock size={18} style={{ color: '#EA580C', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9A3412' }}>{t.quotaTitle}</p>
              <p style={{ fontSize: '0.74rem', marginTop: 2, color: '#C2410C' }}>{t.quotaSub}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INPUT FOOTER ── */}
      <footer className="input-footer" role="contentinfo">
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