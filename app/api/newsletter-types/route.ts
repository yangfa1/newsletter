import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sql = getDb()
    const all = await sql`SELECT * FROM newsletter_types ORDER BY created_at ASC`
    const types = all.filter((t: Record<string, unknown>) => t.active === true)
      .map((t: Record<string, unknown>) => ({
        id: t.id,
        friendly_name: t.friendly_name,
        folder_name: t.folder_name,
        description: t.description
      }))
    return NextResponse.json({ types }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    })
  } catch (err) {
    console.error('[newsletter-types]', err)
    return NextResponse.json({ types: [] })
  }
}
