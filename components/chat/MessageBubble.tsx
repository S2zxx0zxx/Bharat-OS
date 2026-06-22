'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '@/types'
import { getModule } from '@/lib/modules'
import { Volume2, VolumeX, Calculator, Landmark, PhoneCall } from 'lucide-react'

interface Token {
  type: 'text' | 'link' | 'helpline'
  text: string
}

function tokenizeText(text: string): Token[] {
  const combinedRegex = /\b(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.(?:gov\.in|ac\.in|samarth\.ac\.in|com|org|net)(?:\/[^\s]*)?)\b|\b(1800-\d{2,3}-\d{3,4}|\b181\b|\b108\b|\b102\b|\b100\b)\b/gi

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

    if (match[1]) {
      tokens.push({
        type: 'link',
        text: matchStr,
      })
    } else {
      tokens.push({
        type: 'helpline',
        text: matchStr,
      })
    }

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
  return parts.map((part, index) => {
    const isBold = part.startsWith('**') && part.endsWith('**')
    const rawText = isBold ? part.slice(2, -2) : part

    const subParts = tokenizeText(rawText)
    const formatted = subParts.map((sub, sIdx) => {
      if (sub.type === 'link') {
        const url = sub.text.startsWith('http') ? sub.text : `https://${sub.text}`
        return (
          <a
            key={`link-${index}-${sIdx}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all font-semibold"
          >
            {sub.text}
          </a>
        )
      } else if (sub.type === 'helpline') {
        const cleanedPhone = sub.text.replace(/-/g, '')
        return (
          <a
            key={`help-${index}-${sIdx}`}
            href={`tel:${cleanedPhone}`}
            className="bg-orange-100 dark:bg-orange-950/50 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 font-mono px-2.5 py-1 rounded-md text-xs border border-orange-200 dark:border-orange-900/50 inline-flex items-center gap-1 font-bold transition-colors my-1 no-underline"
          >
            <PhoneCall size={10} />
            {sub.text} (Call Now)
          </a>
        )
      } else {
        return sub.text
      }
    })

    if (isBold) {
      return (
        <strong key={`bold-${index}`} className="font-bold text-gray-900 dark:text-white">
          {formatted}
        </strong>
      )
    }
    return <React.Fragment key={`text-${index}`}>{formatted}</React.Fragment>
  })
}

function formatContent(content: string): React.ReactNode {
  if (!content) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let listType: 'bullet' | 'ordered' | null = null

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      if (listType === 'bullet') {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
            {listItems.map((item, idx) => (
              <li key={`li-bullet-${key}-${idx}`}>
                {formatInline(item)}
              </li>
            ))}
          </ul>
        )
      } else if (listType === 'ordered') {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1.5 text-gray-800 dark:text-gray-200">
            {listItems.map((item, idx) => (
              <li key={`li-ordered-${key}-${idx}`}>
                {formatInline(item)}
              </li>
            ))}
          </ol>
        )
      }
      listItems = []
      listType = null
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    const lineKey = `line-${i}-${trimmed.slice(0, 12)}`

    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ')
    const isOrdered = /^\d+\.\s/.test(trimmed)

    if (isBullet) {
      if (listType !== 'bullet') {
        flushList(String(i))
        listType = 'bullet'
      }
      listItems.push(trimmed.substring(2))
    } else if (isOrdered) {
      if (listType !== 'ordered') {
        flushList(String(i))
        listType = 'ordered'
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''))
    } else {
      flushList(String(i))
      if (trimmed === '') {
        if (i > 0) elements.push(<div key={`gap-${lineKey}`} className="h-2" />)
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(
          <p key={lineKey} className="message-heading font-bold text-gray-900 dark:text-white mt-3 mb-1">
            {trimmed.slice(2, -2)}
          </p>
        )
      } else if (trimmed.startsWith('#')) {
        const text = trimmed.replace(/^#+\s/, '')
        elements.push(
          <p key={lineKey} className="message-heading font-bold text-gray-900 dark:text-white mt-3 mb-1">
            {text}
          </p>
        )
      } else if (trimmed.startsWith('⚠️')) {
        elements.push(
          <div key={lineKey} className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-400 p-3.5 my-2 rounded-r-lg text-orange-900 dark:text-orange-200 text-sm shadow-sm flex items-start gap-2">
            <span>{formatInline(trimmed)}</span>
          </div>
        )
      } else if (trimmed.startsWith('✅')) {
        elements.push(
          <div key={lineKey} className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-3.5 my-2 rounded-r-lg text-green-900 dark:text-green-200 text-sm shadow-sm flex items-start gap-2">
            <span>{formatInline(trimmed)}</span>
          </div>
        )
      } else if (trimmed.startsWith('📊')) {
        elements.push(
          <div key={lineKey} className="message-disclaimer">
            {formatInline(trimmed)}
          </div>
        )
      } else {
        elements.push(<p key={lineKey} className="my-1.5 leading-relaxed">{formatInline(trimmed)}</p>)
      }
    }
  })

  flushList('end')
  return elements
}

function EMICalculator() {
  const [amount, setAmount] = useState(1000000)
  const [rate, setRate] = useState(9.5)
  const [tenure, setTenure] = useState(15)

  const p = amount
  const r = rate / 12 / 100
  const n = tenure * 12

  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
  const totalPayment = emi * n
  const totalInterest = totalPayment - p

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 my-3 bg-white/90 dark:bg-gray-950/90 shadow-lg backdrop-blur-md max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
        <Calculator size={16} />
        <span>EMI Calculator Widget</span>
      </div>

      <div className="space-y-3.5">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Loan Amount</span>
            <span className="text-purple-600">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="10000000"
            step="100000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Interest Rate (%)</span>
            <span className="text-purple-600">{rate}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="20"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Tenure (Years)</span>
            <span className="text-purple-600">{tenure} Yrs</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-150 dark:border-gray-800 text-center">
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Monthly EMI</p>
          <p className="text-xs font-bold text-purple-700 dark:text-purple-400">₹{emi.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Total Interest</p>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400">₹{totalInterest.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Total Payment</p>
          <p className="text-xs font-bold text-gray-800 dark:text-white">₹{totalPayment.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </motion.div>
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

export function MessageBubble({ message }: Readonly<{ message: Message }>) {
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

  const handleSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        window.speechSynthesis.cancel()
        const cleanText = message.content
          .replace(/\*\*?/g, '')
          .replace(/\[[^\]]+\]/g, '')
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = 'hi-IN'

        const voices = window.speechSynthesis.getVoices()
        const hindiVoice = voices.find(
          (v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')
        )
        if (hindiVoice) utterance.voice = hindiVoice

        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        setIsPlaying(true)
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
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

            <button
              onClick={handleSpeech}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={isPlaying ? 'Mute' : 'Listen Answer'}
              aria-label={isPlaying ? 'Mute audio reader' : 'Listen to response'}
            >
              {isPlaying ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
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
          {showEMI && <EMICalculator key="emi-calc" />}
          {showSIP && <SIPCalculator key="sip-calc" />}
        </AnimatePresence>

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
