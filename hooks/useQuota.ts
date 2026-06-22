'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuotaState } from '@/types'
import {
  getQuotaFromStorage,
  incrementQuota,
  checkQuotaExceeded,
  getAnonymousUserId,
} from '@/lib/quota'

export function useQuota() {
  const [quota, setQuota] = useState<QuotaState>({
    used: 0,
    limit: 10,
    remaining: 10,
    isPro: false,
    resetDate: new Date().toISOString(),
  })
  const [userId, setUserId] = useState<string>('anon')

  useEffect(() => {
    const id = getAnonymousUserId()
    setUserId(id)
    setQuota(getQuotaFromStorage(id))
  }, [])

  const consumeQuota = useCallback((): boolean => {
    if (checkQuotaExceeded(userId)) {
      return false
    }
    const newQuota = incrementQuota(userId)
    setQuota(newQuota)
    return true
  }, [userId])

  const refreshQuota = useCallback(() => {
    setQuota(getQuotaFromStorage(userId))
  }, [userId])

  const isExceeded = quota.remaining <= 0

  return {
    quota,
    isExceeded,
    consumeQuota,
    refreshQuota,
    userId,
  }
}
