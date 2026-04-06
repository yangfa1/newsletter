import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required.' }, { status: 400 })

  const sql = getDb()
  const result = await sql`
    SELECT email, newsletters FROM subscribers
    WHERE token = ${token} AND status = 'active'
  `
  if (!result.length) {
    return NextResponse.json({ error: 'Invalid or expired link.' }, { status: 404 })
  }
  return NextResponse.json({ email: result[0].email, newsletters: result[0].newsletters })
}

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required.' }, { status: 400 })

  const { newsletters, unsubscribeAll } = await req.json()
  const sql = getDb()

  if (unsubscribeAll) {
    const result = await sql`
      UPDATE subscribers SET status = 'inactive', updated_at = now()
      WHERE token = ${token} AND status = 'active'
      RETURNING email
    `
    if (!result.length) return NextResponse.json({ error: 'Invalid or expired link.' }, { status: 404 })
    return NextResponse.json({ message: "You've been unsubscribed from all newsletters." })
  }

  if (!newsletters?.length) {
    return NextResponse.json({ error: 'Select at least one newsletter.' }, { status: 400 })
  }

  const result = await sql`
    UPDATE subscribers SET newsletters = ${newsletters}, updated_at = now()
    WHERE token = ${token} AND status = 'active'
    RETURNING email
  `
  if (!result.length) return NextResponse.json({ error: 'Invalid or expired link.' }, { status: 404 })
  return NextResponse.json({ message: 'Your preferences have been updated!' })
}
