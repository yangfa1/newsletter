import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { friendly_name, description, active } = await req.json()
  const sql = getDb()

  const result = await sql`
    UPDATE newsletter_types
    SET
      friendly_name = COALESCE(${friendly_name ?? null}, friendly_name),
      description   = COALESCE(${description ?? null}, description),
      active        = COALESCE(${active ?? null}, active)
    WHERE id = ${params.id}
    RETURNING *
  `
  if (!result.length) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  return NextResponse.json({ type: result[0] })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  await sql`DELETE FROM newsletter_types WHERE id = ${params.id}`
  return NextResponse.json({ success: true })
}
