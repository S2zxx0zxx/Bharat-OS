'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '@/types'
import { getModule } from '@/lib/modules'
import { Landmark } from 'lucide-react'

interface Token {
  type: 'text' | 'link' | 'helpline'
  text: string
}

function tokenizeText(text: string): Token[] {
  const combinedRegex = /(https?:\/\/\S+|[a-zA-Z0-9.-]+\.(?:gov\.in|ac\.in|com|org|net)(?:\/\S*)?|1800-\d{2,3}-\d{3,4}|181|108|102|100)/gi

  const tokens: Token[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  combinedRegex.lastIndex = 0

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchIndex = match.index
    const matchStr = match[0]

    if (matchIndex > lastIndex) {
      tokens.push({
        type: 'text',
        text: text.substring(lastIndex, matchIndex),
      })
    }

    const isHelpline = /^(1800-\d{2,3}-\d{3,4}|181|108|102|100)$/.test(matchStr)
    tokens.push({
      type: isHelpline ? 'helpline' : 'link',
      text: matchStr,
    })

    lastIndex = combinedRegex.lastIndex
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      text: text.substring(lastIndex),
    })
  }

  return tokens
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  const seenKeys = new Map<string, number>()
  const getUniqueKey = (prefix: string, val: string) => {
    const sanitizedVal = val.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)
    const baseKey = `${prefix}-${sanitizedVal}`
    const count = seenKeys.get(baseKey) || 0
    seenKeys.set(baseKey, count + 1)
    return count === 0 ? baseKey : `${baseKey}-${count}`
  }

  return parts.map((part) => {
    const isBold = part.startsWith('**') && part.endsWith('**')
    const rawText = isBold ? part.slice(2, -2) : part

    const subParts = tokenizeText(rawText)
    const formatted = subParts.map((sub) => {
      if (sub.type === 'link') {
        const url = sub.text.startsWith('http') ? sub.text : `https://${sub.text}`
        const isGov = sub.text.includes('.gov.in') || sub.text.includes('.nic.in')
        if (isGov) {
          return (
            <a
              key={getUniqueKey('link-gov', sub.text)}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-card"
            >
              <span>🏛️ {sub.text}</span>
              <span>→</span>
            </a>
          )
        }
        return (
          <a
            key={getUniqueKey('link-normal', sub.text)}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all font-semibold"
          >
            {sub.text}
          </a>
        )
      } else if (sub.type === 'helpline') {
        return (
          <a
            key={getUniqueKey('help', sub.text)}
            href={`tel:${sub.text.replaceAll('-', '')}`}
            className="helpline-call-btn"
          >
            📞 {sub.text}
          </a>
        )
      } else {
        return sub.text
      }
    })

    if (isBold) {
      return (
        <strong key={getUniqueKey('bold', rawText)} className="font-bold text-gray-900 dark:text-white">
          {formatted}
        </strong>
      )
    }
    return <React.Fragment key={getUniqueKey('text', rawText)}>{formatted}</React.Fragment>
  })
}

// Extracted helper to reduce cognitive complexity of formatContent
function getSpecialLineElement(trimmed: string, lineKey: string, i: number): React.ReactNode | null {
  if (trimmed === '') {
    return i > 0 ? <div key={`gap-${lineKey}`} className="h-2" /> : null
  }
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    return (
      <p key={lineKey} className="message-heading font-bold text-gray-900 dark:text-white mt-3 mb-1">
        {trimmed.slice(2, -2)}
      </p>
    )
  }
  if (trimmed.startsWith('#')) {
    const text = trimmed.replace(/^#+\s/, '')
    return (
      <p key={lineKey} className="message-heading font-bold text-gray-900 dark:text-white mt-3 mb-1">
        {text}
      </p>
    )
  }
  if (trimmed.startsWith('⚠️')) {
    return (
      <div key={lineKey} className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-400 p-3.5 my-2 rounded-r-lg text-orange-900 dark:text-orange-200 text-sm shadow-sm flex items-start gap-2">
        <span>{formatInline(trimmed)}</span>
      </div>
    )
  }
  if (trimmed.startsWith('✅')) {
    return (
      <div key={lineKey} className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-3.5 my-2 rounded-r-lg text-green-900 dark:text-green-200 text-sm shadow-sm flex items-start gap-2">
        <span>{formatInline(trimmed)}</span>
      </div>
    )
  }
  if (trimmed.startsWith('📊')) {
    return (
      <div key={lineKey} className="message-disclaimer">
        {formatInline(trimmed)}
      </div>
    )
  }
  return null
}

function flushListHelper(listItems: string[], listType: 'bullet' | 'ordered' | null, key: string): React.ReactNode | null {
  if (listItems.length === 0) return null
  if (listType === 'bullet') {
    return (
      <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
        {listItems.map((item) => (
          <li key={`li-bullet-${key}-${item.slice(0, 35)}`}>
            {formatInline(item)}
          </li>
        ))}
      </ul>
    )
  }
  if (listType === 'ordered') {
    return (
      <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
        {listItems.map((item) => (
          <li key={`li-ordered-${key}-${item.slice(0, 35)}`}>
            {formatInline(item)}
          </li>
        ))}
      </ol>
    )
  }
  return null
}

function formatContent(content: string): React.ReactNode {
  if (!content) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let listType: 'bullet' | 'ordered' | null = null

  const handleFlush = (key: string) => {
    const el = flushListHelper(listItems, listType, key)
    if (el) elements.push(el)
    listItems = []
    listType = null
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    const lineKey = `line-${i}-${trimmed.slice(0, 12)}`

    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ')
    const isOrdered = /^\d+\.\s/.test(trimmed)

    if (isBullet) {
      if (listType !== 'bullet') {
        handleFlush(String(i))
        listType = 'bullet'
      }
      listItems.push(trimmed.substring(2))
    } else if (isOrdered) {
      if (listType !== 'ordered') {
        handleFlush(String(i))
        listType = 'ordered'
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''))
    } else {
      handleFlush(String(i))
      const special = getSpecialLineElement(trimmed, lineKey, i)
      if (special !== null) {
        elements.push(special)
      } else if (trimmed !== '') {
        elements.push(<p key={lineKey} className="my-1.5 leading-relaxed">{formatInline(trimmed)}</p>)
      }
    }
  })

  handleFlush('end')
  return elements
}

function EMIWidget({ moduleColor }: Readonly<{ moduleColor: string }>) {
  const [loan, setLoan] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const p = loan
  const r = rate / 1200
  const n = tenure * 12
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))

  return (
    <div className="widget-card">
      <div className="widget-title">💰 EMI Calculator</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Loan: ₹{loan.toLocaleString('en-IN')}
          </label>
          <input
            type="range"
            min={100000}
            max={10000000}
            step={50000}
            value={loan}
            onChange={(e) => setLoan(+e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Interest: {rate}% p.a.
          </label>
          <input
            type="range"
            min={6}
            max={20}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Tenure: {tenure} years
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
          />
        </div>
        <div>
          <div className="widget-result" style={{ color: moduleColor }}>
            ₹{emi.toLocaleString('en-IN')}
          </div>
          <div className="widget-label">Monthly EMI</div>
        </div>
      </div>
    </div>
  )
}

function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(12)
  const [tenure, setTenure] = useState(10)

  const p = monthly
  const i = rate / 12 / 100
  const n = tenure * 12

  const totalValue = Math.round(p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i))
  const investedAmount = p * n
  const estReturns = totalValue - investedAmount

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 my-3 bg-white/90 dark:bg-gray-950/90 shadow-lg backdrop-blur-md max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
        <Landmark size={16} />
        <span>SIP Calculator Widget</span>
      </div>

      <div className="space-y-3.5">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Monthly Investment</span>
            <span className="text-amber-600">₹{monthly.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Expected Return Rate (%)</span>
            <span className="text-amber-600">{rate}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Time Period (Years)</span>
            <span className="text-amber-600">{tenure} Yrs</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-150 dark:border-gray-800 text-center">
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Invested</p>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">₹{investedAmount.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Est. Returns</p>
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">₹{estReturns.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Total Value</p>
          <p className="text-xs font-bold text-gray-900 dark:text-white">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function MessageBubble(props: Readonly<{ message: Message }>) {
  const { message } = props
  const module = getModule(message.moduleId)
  const isUser = message.role === 'user'
  const timeStr = message.timestamp.toLocaleTimeString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [showEMI, setShowEMI] = useState(false)
  const [showSIP, setShowSIP] = useState(false)

  useEffect(() => {
    const textLower = message.content.toLowerCase()
    if (!isUser) {
      if (textLower.includes('emi') || textLower.includes('loan')) {
        setShowEMI(true)
      }
      if (textLower.includes('sip') || textLower.includes('invest')) {
        setShowSIP(true)
      }
    }
  }, [message.content, isUser])

  const handleTTS = (text: string) => {
    if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) {
      const synth = globalThis.speechSynthesis
      if (isPlaying) {
        synth.cancel()
        setIsPlaying(false)
      } else {
        synth.cancel()
        const cleanText = text
          .replaceAll('⚠️', '')
          .replaceAll('✅', '')
          .replaceAll('📞', '')
        const utterance = new globalThis.SpeechSynthesisUtterance(cleanText)
        utterance.lang = 'hi-IN'
        utterance.rate = 0.9

        const voices = synth.getVoices()
        const hindiVoice = voices.find(
          (v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')
        )
        if (hindiVoice) utterance.voice = hindiVoice

        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        setIsPlaying(true)
        synth.speak(utterance)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) {
        globalThis.speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`message-row ${isUser ? 'message-row-user' : 'message-row-ai'}`}
    >
      {!isUser && (
        <div className="message-avatar" style={{ background: module.gradient }}>
          <span role="img" aria-hidden="true">{module.emoji}</span>
        </div>
      )}

      <div className={`message-bubble-wrapper ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2">
            <div
              className="message-module-tag"
              style={{ background: module.colorLight, color: module.color }}
            >
              {module.name}
              {message.tier && (
                <span className="message-tier-badge">
                  T{message.tier}
                </span>
              )}
            </div>
          </div>
        )}

        <div
          className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-ai'}`}
          style={
            isUser
              ? { background: module.gradient }
              : {}
          }
        >
          <div className={`message-content ${isUser ? 'text-white' : ''}`}>
            {formatContent(message.content)}
          </div>
        </div>

        <AnimatePresence>
          {showEMI && <EMIWidget key="emi-calc" moduleColor={module.color} />}
          {showSIP && <SIPCalculator key="sip-calc" />}
        </AnimatePresence>

        {message.role === 'assistant' && !message.isLoading && (
          <button
            className={`tts-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => handleTTS(message.content)}
            title="Sunein"
          >
            {isPlaying ? '🔇 Band Karein' : '🔊 Sunein'}
          </button>
        )}

        <span className="message-timestamp">{timeStr}</span>
      </div>

      {isUser && (
        <div className="message-avatar message-avatar-user">
          <span>👤</span>
        </div>
      )}
    </motion.div>
  )
}
