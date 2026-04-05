import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  const types = await sql`SELECT * FROM newsletter_types ORDER BY created_at ASC`
  return NextResponse.json({ types })
}

export async function POST(req: Request) {
  const session = await verifyAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { friendly_name, folder_name, description } = await req.json()
  if (!friendly_name || !folder_name) {
    return NextResponse.json({ error: 'friendly_name and folder_name are required.' }, { status: 400 })
  }

  // Validate folder_name format
  if (!/^[a-z0-9-]+$/.test(folder_name)) {
    return NextResponse.json({ error: 'folder_name must be lowercase letters, numbers, and hyphens only.' }, { status: 400 })
  }

  const sql = getDb()
  try {
    const result = await sql`
      INSERT INTO newsletter_types (friendly_name, folder_name, description)
      VALUES (${friendly_name}, ${folder_name}, ${description || null})
      RETURNING *
    `
    return NextResponse.json({ type: result[0] })
  } catch {
    return NextResponse.json({ error: 'folder_name already exists.' }, { status: 409 })
  }
}
