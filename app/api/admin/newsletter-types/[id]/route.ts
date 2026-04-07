import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const sql = getDb()

  // Update each field separately only if provided
  if (body.active !== undefined) {
    const isActive = body.active === true || body.active === 'true'
    await sql`UPDATE newsletter_types SET active = ${isActive} WHERE id = ${params.id}`
  }
  if (body.friendly_name !== undefined) {
    await sql`UPDATE newsletter_types SET friendly_name = ${body.friendly_name} WHERE id = ${params.id}`
  }
  if (body.description !== undefined) {
    await sql`UPDATE newsletter_types SET description = ${body.description} WHERE id = ${params.id}`
  }

  const result = await sql`SELECT * FROM newsletter_types WHERE id = ${params.id}`
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
