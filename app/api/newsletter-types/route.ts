import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getDb()
    const types = await sql`
      SELECT id, friendly_name, folder_name, description
      FROM newsletter_types
      WHERE active = true
      ORDER BY created_at ASC
    `
    console.log('[newsletter-types] returned:', types.length, types.map((t: Record<string, unknown>) => t.folder_name))
    return NextResponse.json({ types, debug_count: types.length }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    })
  } catch (err) {
    console.error('[newsletter-types]', err)
    return NextResponse.json({ types: [] })
  }
}
