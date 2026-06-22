import { NextRequest } from 'next/server'
import { getModule, detectModuleFromKeywords, detectQueryTier } from '@/lib/modules'
import { generateResponse } from '@/lib/gemini'
import { securityCheck } from '@/lib/security'
import { ModuleId, ApiChatRequest } from '@/types'

function sanitizeHistory(
  history: Array<{ role: string; content: string }>
): Array<{ role: string; content: string }> {
  return history.map((msg) => {
    const check = securityCheck(msg.content)
    return {
      role: msg.role,
      content: check.isSafe ? check.sanitizedQuery : '[message redacted]',
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'Gemini API key galat hai — .env.local check karo' },
        { status: 500 }
      )
    }

    const body: ApiChatRequest = await req.json()
    const { query, moduleId, conversationHistory = [] } = body

    // Validate input
    if (!query?.trim()) {
      return Response.json(
        { error: 'Sawaal khali nahi ho sakta' },
        { status: 400 }
      )
    }

    // Security check (ruflo-aidefence pattern)
    const security = securityCheck(query)
    if (!security.isSafe) {
      return Response.json(
        { error: 'Ye sawaal nahi kar sakte. Koi genuine sawaal poochein.' },
        { status: 400 }
      )
    }

    // Detect module and tier
    const activeModuleId: ModuleId =
      moduleId ?? detectModuleFromKeywords(security.sanitizedQuery)
    const module = getModule(activeModuleId)
    const tier = detectQueryTier(security.sanitizedQuery)

    // Generate AI response
    const { text, tokensUsed } = await generateResponse(
      security.sanitizedQuery,
      module,
      sanitizeHistory(conversationHistory),
      tier
    )

    return Response.json({
      response: text,
      moduleId: activeModuleId,
      moduleName: module.name,
      tier,
      tokensUsed,
      piiWarnings: security.warnings,
    })
  } catch (error: unknown) {
    // Log the exact error message
    console.error('API route error caught:', error)

    let message = 'Unknown error'
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object') {
      message = 'message' in error ? String((error as any).message) : JSON.stringify(error)
    }

    const errLower = message.toLowerCase()

    // If API key invalid
    if (
      errLower.includes('api_key_invalid') ||
      errLower.includes('api key') ||
      errLower.includes('invalid api key') ||
      errLower.includes('key not configured') ||
      errLower.includes('not found for api version') ||
      errLower.includes('is not found')
    ) {
      return Response.json(
        { error: 'Gemini API key galat hai — .env.local check karo' },
        { status: 400 }
      )
    }

    // If quota exceeded
    if (
      errLower.includes('quota') ||
      errLower.includes('429') ||
      errLower.includes('resource_exhausted') ||
      errLower.includes('exhausted')
    ) {
      return Response.json(
        { error: 'Gemini free quota khatam ho gayi — kal try karo' },
        { status: 429 }
      )
    }

    // If network error
    if (
      errLower.includes('fetch failed') ||
      errLower.includes('network') ||
      errLower.includes('enotfound') ||
      errLower.includes('connect') ||
      errLower.includes('timeout')
    ) {
      return Response.json(
        { error: 'Internet connection check karo' },
        { status: 503 }
      )
    }

    return Response.json(
      { error: `Kuch gadbad ho gayi. Thodi der baad dobara try karein. (${message})` },
      { status: 500 }
    )
  }
}
