import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/?unsubscribe=invalid', req.url))

  try {
    const sql = getDb()
    const result = await sql`
      UPDATE subscribers
      SET status = 'inactive', updated_at = now()
      WHERE token = ${token} AND status = 'active'
      RETURNING email
    `
    if (!result.length) {
      return NextResponse.redirect(new URL('/?unsubscribe=notfound', req.url))
    }
    return NextResponse.redirect(new URL('/?unsubscribe=success', req.url))
  } catch (err) {
    console.error('[unsubscribe-link]', err)
    return NextResponse.redirect(new URL('/?unsubscribe=error', req.url))
  }
}
