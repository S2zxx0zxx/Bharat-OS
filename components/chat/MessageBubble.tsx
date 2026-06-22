'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Message } from '@/types'
import { getModule } from '@/lib/modules'

function formatContent(content: string): React.ReactNode {
  if (!content) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="message-list">
          {listItems.map((item) => (
            <li key={`li-${key}-${item.slice(0, 20)}`} className="message-list-item">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    const lineKey = `line-${i}-${trimmed.slice(0, 12)}`

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      listItems.push(trimmed.substring(2))
    } else if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ''))
    } else {
      flushList(String(i))
      if (trimmed === '') {
        if (i > 0) elements.push(<div key={`gap-${lineKey}`} className="h-2" />)
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(
          <p key={lineKey} className="message-heading">
            {trimmed.slice(2, -2)}
          </p>
        )
      } else if (trimmed.startsWith('#')) {
        const text = trimmed.replace(/^#+\s/, '')
        elements.push(
          <p key={lineKey} className="message-heading">
            {text}
          </p>
        )
      } else if (trimmed.startsWith('⚠️') || trimmed.startsWith('📊')) {
        elements.push(
          <div key={lineKey} className="message-disclaimer">
            {formatInline(trimmed)}
          </div>
        )
      } else {
        elements.push(<p key={lineKey}>{formatInline(trimmed)}</p>)
      }
    }
  })

  flushList('end')
  return elements
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`bold-${part}`}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export function MessageBubble({ message }: Readonly<{ message: Message }>) {
  const module = getModule(message.moduleId)
  const isUser = message.role === 'user'
  const timeStr = message.timestamp.toLocaleTimeString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

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
