import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sql = getDb()
  // Force update market-forecast to active
  await sql`UPDATE newsletter_types SET active = true WHERE folder_name = 'market-forecast'`
  const result = await sql`SELECT folder_name, active FROM newsletter_types ORDER BY created_at ASC`
  return NextResponse.json({ updated: result })
}
