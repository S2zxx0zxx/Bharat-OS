'use client'

import { useState, useCallback, useRef } from 'react'
import { Message, ModuleId, ApiChatResponse } from '@/types'
import { getModule } from '@/lib/modules'

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function useChat(activeModuleId: ModuleId) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const conversationIdRef = useRef<string>(generateId())

  const sendMessage = useCallback(
    async (query: string): Promise<void> => {
      if (!query.trim() || isLoading) return

      const module = getModule(activeModuleId)

      // Add user message immediately
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: query.trim(),
        moduleId: activeModuleId,
        moduleName: module.name,
        timestamp: new Date(),
      }

      // Add loading placeholder
      const loadingId = generateId()
      const loadingMessage: Message = {
        id: loadingId,
        role: 'assistant',
        content: '',
        moduleId: activeModuleId,
        moduleName: module.name,
        timestamp: new Date(),
        isLoading: true,
      }

      setMessages((prev) => [...prev, userMessage, loadingMessage])
      setIsLoading(true)
      setError(null)

      try {
        // Build conversation history (exclude the loading message)
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            moduleId: activeModuleId,
            conversationHistory: history,
          }),
        })

        const data: ApiChatResponse & { error?: string } = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error ?? 'Unknown API error')
        }

        // Replace loading message with real response
        const assistantMessage: Message = {
          id: loadingId,
          role: 'assistant',
          content: data.response,
          moduleId: data.moduleId,
          moduleName: data.moduleName,
          timestamp: new Date(),
          isLoading: false,
          tier: data.tier,
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === loadingId ? assistantMessage : m))
        )
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Kuch gadbad ho gayi'

        setError(errorMessage)

        // Remove loading message on error
        setMessages((prev) => prev.filter((m) => m.id !== loadingId))
      } finally {
        setIsLoading(false)
      }
    },
    [activeModuleId, isLoading, messages]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    conversationIdRef.current = generateId()
  }, [])

  return {
    messages,
    isLoading,
    error,
    conversationId: conversationIdRef.current,
    sendMessage,
    clearMessages,
  }
}
