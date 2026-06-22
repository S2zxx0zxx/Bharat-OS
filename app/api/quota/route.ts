import { NextRequest } from 'next/server'

const FREE_QUOTA = 1000

export async function GET(req: NextRequest) {
  try {
    const userId =
      req.nextUrl.searchParams.get('userId') ?? 'anon'

    // In a full implementation, this would query Supabase for logged-in users.
    // For anonymous users we rely on client-side localStorage tracking.
    // Return current quota info — client handles localStorage state.
    const resetDate = new Date()
    resetDate.setHours(23, 59, 59, 999)

    return Response.json({
      used: 0,
      limit: FREE_QUOTA,
      remaining: FREE_QUOTA,
      isPro: false,
      resetDate: resetDate.toISOString(),
      userId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Quota check failed: ${message}` },
      { status: 500 }
    )
  }
}
