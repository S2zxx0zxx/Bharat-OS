import { NextRequest } from 'next/server'
import { fetchPincodeInfo } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code || !/^\d{6}$/.test(code)) {
    return Response.json(
      { error: 'Valid 6-digit pincode required. Example: /api/pincode?code=110001' },
      { status: 400 }
    )
  }

  const info = await fetchPincodeInfo(code)

  if (!info) {
    return Response.json(
      { error: `Pincode ${code} ka data nahi mila. Check karein aur dobara try karein.` },
      { status: 404 }
    )
  }

  return Response.json({
    pincode: code,
    ...info,
    fetchedAt: new Date().toISOString(),
  })
}
