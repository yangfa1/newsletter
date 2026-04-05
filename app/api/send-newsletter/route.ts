import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const getFrom = () => process.env.FROM_EMAIL || 'onboarding@resend.dev'
const BASE = () => process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Format date string "2026-04-07" → "Apr 7, 2026"
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Generate subject: "Weekly Financial Report — Apr 7, 2026"
function buildSubject(friendlyName: string, dateStr: string): string {
  return `${friendlyName} — ${formatDate(dateStr)}`
}

// Replace {{UNSUBSCRIBE_URL}} placeholder in HTML
function injectUnsubscribeUrl(html: string, token: string): string {
  const url = `${BASE()}/api/unsubscribe-link?token=${token}`
  return html.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, url)
}

export async function POST(req: Request) {
  try {
    // Verify send token
    const auth = req.headers.get('authorization') || ''
    const token = auth.replace('Bearer ', '').trim()
    if (!token || token !== process.env.NEWSLETTER_SEND_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { folder_name, date, html } = await req.json()
    if (!folder_name || !date || !html) {
      return NextResponse.json({ error: 'folder_name, date, and html are required.' }, { status: 400 })
    }

    const sql = getDb()

    // Look up newsletter type
    const types = await sql`
      SELECT * FROM newsletter_types WHERE folder_name = ${folder_name} AND active = true
    `
    if (!types.length) {
      return NextResponse.json({ error: `Newsletter type "${folder_name}" not found or inactive.` }, { status: 404 })
    }
    const newsletterType = types[0]
    const subject = buildSubject(newsletterType.friendly_name, date)

    // Fetch active subscribers for this newsletter type
    const subscribers = await sql`
      SELECT email, token FROM subscribers
      WHERE status = 'active'
      AND ${folder_name} = ANY(newsletters)
    `

    if (!subscribers.length) {
      return NextResponse.json({ message: 'No active subscribers for this newsletter.', sent: 0 })
    }

    const resend = getResend()
    const from = getFrom()
    let sent = 0
    let failed = 0
    const errors: string[] = []

    // Send in batches of 50
    const BATCH_SIZE = 50
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)

      await Promise.all(batch.map(async (subscriber) => {
        try {
          const personalizedHtml = injectUnsubscribeUrl(html, subscriber.token)
          await resend.emails.send({
            from,
            to: subscriber.email,
            subject,
            html: personalizedHtml,
          })
          sent++
        } catch (err) {
          failed++
          errors.push(`${subscriber.email}: ${err}`)
          console.error(`Failed to send to ${subscriber.email}:`, err)
        }
      }))

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log(`Newsletter "${subject}" sent: ${sent} success, ${failed} failed`)

    return NextResponse.json({
      message: `Newsletter sent successfully.`,
      subject,
      sent,
      failed,
      errors: errors.length ? errors : undefined,
    })

  } catch (err) {
    console.error('[send-newsletter]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
