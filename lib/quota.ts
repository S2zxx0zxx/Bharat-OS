import { QuotaState } from '@/types'

const FREE_QUOTA = 1000
const QUOTA_KEY_PREFIX = 'bharatos-quota'

interface StoredQuota {
  used: number
  resetDate: string
}

function getTodayKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0]
  return `${QUOTA_KEY_PREFIX}-${userId}-${today}`
}

export function getQuotaFromStorage(userId: string): QuotaState {
  if (globalThis.window === undefined) {
    return {
      used: 0,
      limit: FREE_QUOTA,
      remaining: FREE_QUOTA,
      isPro: false,
      resetDate: new Date().toISOString(),
    }
  }

  try {
    const key = getTodayKey(userId)
    const raw = localStorage.getItem(key)

    if (!raw) {
      return {
        used: 0,
        limit: FREE_QUOTA,
        remaining: FREE_QUOTA,
        isPro: false,
        resetDate: new Date().toISOString(),
      }
    }

    const stored: StoredQuota = JSON.parse(raw)
    const used = stored.used ?? 0
    const remaining = Math.max(0, FREE_QUOTA - used)

    return {
      used,
      limit: FREE_QUOTA,
      remaining,
      isPro: false,
      resetDate: stored.resetDate,
    }
  } catch {
    return {
      used: 0,
      limit: FREE_QUOTA,
      remaining: FREE_QUOTA,
      isPro: false,
      resetDate: new Date().toISOString(),
    }
  }
}

export function incrementQuota(userId: string): QuotaState {
  if (globalThis.window === undefined) {
    return getQuotaFromStorage(userId)
  }

  const current = getQuotaFromStorage(userId)
  const newUsed = current.used + 1
  const key = getTodayKey(userId)

  const stored: StoredQuota = {
    used: newUsed,
    resetDate: new Date(Date.now() + 86400000).toISOString(),
  }

  localStorage.setItem(key, JSON.stringify(stored))

  return {
    used: newUsed,
    limit: FREE_QUOTA,
    remaining: Math.max(0, FREE_QUOTA - newUsed),
    isPro: false,
    resetDate: stored.resetDate,
  }
}

export function checkQuotaExceeded(userId: string): boolean {
  const quota = getQuotaFromStorage(userId)
  return quota.remaining <= 0
}

function cleanOldQuotaKeys(): void {
  if (globalThis.window === undefined) return
  const today = new Date().toISOString().split('T')[0]
  const keysToDelete: string[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(QUOTA_KEY_PREFIX) && !key.includes(today)) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(k => localStorage.removeItem(k))
}

export function getAnonymousUserId(): string {
  cleanOldQuotaKeys()
  if (globalThis.window === undefined) return 'server'

  let id = localStorage.getItem('bharatos-anon-id')
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem('bharatos-anon-id', id)
  }
  return id
}
