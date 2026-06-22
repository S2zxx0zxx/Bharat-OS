import { GoogleGenerativeAI } from '@google/generative-ai'
import { Module, Tier } from '@/types'

let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
  return genAI
}

export interface GeminiResponse {
  text: string
  tokensUsed: number
}

export async function generateResponse(
  query: string,
  module: Module,
  conversationHistory: Array<{ role: string; content: string }>,
  tier: Tier
): Promise<GeminiResponse> {
  const ai = getGenAI()
  const modelName = 'gemini-2.0-flash'

  const maxTokensByTier: Record<Tier, number> = {
    1: 512,
    2: 800,
    3: 1200,
  }

  const model = ai.getGenerativeModel({
    model: modelName,
    systemInstruction: module.systemPrompt,
  })

  // Map conversation history to Gemini format
  const history = conversationHistory.map((msg) => ({
    role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({
    history,
    generationConfig: {
      temperature: tier === 1 ? 0.5 : 0.7,
      maxOutputTokens: maxTokensByTier[tier],
      topP: 0.95,
    },
  })

  const result = await chat.sendMessage(query)
  const text = result.response.text()
  const tokensUsed = result.response.usageMetadata?.totalTokenCount ?? 0

  return { text, tokensUsed }
}
