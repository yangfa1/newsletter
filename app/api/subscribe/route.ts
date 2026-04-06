import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'
import { sendVerificationEmail, sendManageLink } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, newsletters } = await req.json()
    if (!email || !newsletters?.length) {
      return NextResponse.json({ error: 'Email and at least one newsletter required.' }, { status: 400 })
    }
    const normalizedEmail = email.toLowerCase().trim()
    const sql = getDb()

    const existing = await sql`SELECT * FROM subscribers WHERE email = ${normalizedEmail}`

    if (existing.length > 0) {
      const sub = existing[0]

      if (sub.status === 'active') {
        // Existing active subscriber → send manage link
        await sendManageLink(normalizedEmail, sub.token)
        return NextResponse.json({
          message: `You're already subscribed! We've sent a link to manage your preferences.`
        })
      } else if (sub.status === 'pending') {
        // Resend verification
        const result = await sql`
          UPDATE subscribers
          SET newsletters = ${newsletters}, token = gen_random_uuid(), updated_at = now()
          WHERE email = ${normalizedEmail}
          RETURNING token
        `
        await sendVerificationEmail(normalizedEmail, result[0].token)
        return NextResponse.json({
          message: `We've resent your verification link to ${normalizedEmail}. Please check your inbox!`
        })
      } else {
        // Inactive → reactivate
        const result = await sql`
          UPDATE subscribers
          SET status = 'pending', newsletters = ${newsletters}, token = gen_random_uuid(), updated_at = now()
          WHERE email = ${normalizedEmail}
          RETURNING token
        `
        await sendVerificationEmail(normalizedEmail, result[0].token)
        return NextResponse.json({
          message: `Welcome back! We've sent a verification link to ${normalizedEmail}.`
        })
      }
    }

    // New subscriber
    const result = await sql`
      INSERT INTO subscribers (email, newsletters, status)
      VALUES (${normalizedEmail}, ${newsletters}, 'pending')
      RETURNING token
    `
    await sendVerificationEmail(normalizedEmail, result[0].token)
    return NextResponse.json({
      message: `We've sent a verification link to ${normalizedEmail}. Please check your inbox!`
    })

  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
