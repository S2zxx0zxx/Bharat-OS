import { NextRequest } from 'next/server'
import {
  detectModuleFromKeywords,
  detectQueryTier,
  getModule,
} from '@/lib/modules'
import { securityCheck } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const body: { query: string } = await req.json()
    const { query } = body

    if (!query?.trim()) {
      return Response.json({ error: 'Query required' }, { status: 400 })
    }

    const security = securityCheck(query)
    if (!security.isSafe) {
      return Response.json(
        { error: 'Suspicious query detected' },
        { status: 400 }
      )
    }

    const moduleId = detectModuleFromKeywords(security.sanitizedQuery)
    const module = getModule(moduleId)
    const tier = detectQueryTier(security.sanitizedQuery)

    return Response.json({
      moduleId,
      moduleName: module.name,
      tier,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Detection failed: ${message}` },
      { status: 500 }
    )
  }
}
