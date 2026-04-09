import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const pooling = process.env.POSTGRES_URL || ''
  const direct = process.env.POSTGRES_URL_NON_POOLING || ''
  const active = process.env.POSTGRES_URL_NON_POOLING ? 'NON_POOLING' : 'POOLING'

  return NextResponse.json({
    active_url: active,
    pooling_host: pooling.split('@')[1]?.split('/')[0] || 'not set',
    direct_host: direct.split('@')[1]?.split('/')[0] || 'not set',
  })
}
