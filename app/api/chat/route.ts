import { NextRequest } from 'next/server'
import { getModule, detectModuleFromKeywords, detectQueryTier } from '@/lib/modules'
import { generateResponse } from '@/lib/gemini'
import { securityCheck } from '@/lib/security'
import { ModuleId, ApiChatRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
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
      conversationHistory,
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
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message.includes('API_KEY') || message.includes('GEMINI')) {
      return Response.json(
        { error: 'API configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    return Response.json(
      { error: 'Kuch gadbad ho gayi. Thodi der baad dobara try karein.' },
      { status: 500 }
    )
  }
}
