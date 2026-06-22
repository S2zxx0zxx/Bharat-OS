export type ModuleId = 'legal' | 'govt' | 'health' | 'finance' | 'agri' | 'edu'

export type Tier = 1 | 2 | 3

export interface Module {
  id: ModuleId
  name: string
  emoji: string
  color: string
  colorLight: string
  colorDark: string
  gradient: string
  description: string
  systemPrompt: string
  suggestions: string[]
  keywords: string[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  moduleId: ModuleId
  moduleName: string
  timestamp: Date
  isLoading?: boolean
  tier?: Tier
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  conversationId: string | null
}

export interface QuotaState {
  used: number
  limit: number
  remaining: number
  isPro: boolean
  resetDate: string
}

export interface ApiChatRequest {
  query: string
  moduleId: ModuleId
  conversationHistory: Array<{ role: string; content: string }>
  userId?: string
}

export interface ApiChatResponse {
  response: string
  moduleId: ModuleId
  moduleName: string
  tier: Tier
  tokensUsed: number
  piiWarnings?: string[]
}

export interface SecurityCheckResult {
  isSafe: boolean
  hasPII: boolean
  sanitizedQuery: string
  warnings: string[]
}

export interface DetectApiResponse {
  moduleId: ModuleId
  moduleName: string
  tier: Tier
}

export interface QuotaApiResponse {
  used: number
  limit: number
  remaining: number
  isPro: boolean
  resetDate: string
}
