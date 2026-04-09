import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  headers() // prevent edge/CDN caching — same behaviour as authenticated routes
  try {
    const sql = getDb()
    const all = await sql`SELECT * FROM newsletter_types ORDER BY created_at ASC`
    const types = all.filter((t: Record<string, unknown>) => t.active === true || t.active === 'true' || t.active === 't')
      .map((t: Record<string, unknown>) => ({
        id: t.id,
        friendly_name: t.friendly_name,
        folder_name: t.folder_name,
        description: t.description,
        active: t.active,
        created_at: t.created_at
      }))
    return NextResponse.json({ types }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    })
  } catch (err) {
    console.error('[newsletter-types]', err)
    return NextResponse.json({ types: [] })
  }
}
