import { Resend } from 'resend'

const getResend = () => new Resend(process.env.RESEND_API_KEY)
const getFrom = () => process.env.FROM_EMAIL || 'newsletter@wisewin.ca'
const getBase = () => process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const resend = getResend()
  const from = getFrom()
  const base = getBase()
  const link = `${base}/api/verify?token=${token}`
  await resend.emails.send({
    from,
    to: email,
    subject: '✅ Confirm your Wise Win Newsletter subscription',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#0158a0;color:white;font-weight:bold;padding:8px 16px;border-radius:8px;">WW 慧盈财富</div>
        </div>
        <h2 style="color:#0a3d6e;font-size:22px;margin-bottom:12px;">Confirm your subscription</h2>
        <p style="color:#4b5563;line-height:1.6;margin-bottom:24px;">
          Thanks for subscribing to Wise Win Financial newsletters! Click the button below to confirm your email address.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#e8b400;color:#072848;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;">
            Confirm Subscription
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          This link expires in 24 hours. If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} Wise Win Financial · <a href="https://www.wisewin.ca" style="color:#9ca3af;">wisewin.ca</a>
        </p>
      </div>
    `,
  })
}

export async function sendUnsubscribeConfirmEmail(email: string) {
  const resend = getResend()
  const from = getFrom()
  const base = getBase()
  await resend.emails.send({
    from,
    to: email,
    subject: "You've been unsubscribed from Wise Win Newsletter",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
        <h2 style="color:#0a3d6e;">Unsubscribe confirmed</h2>
        <p style="color:#4b5563;line-height:1.6;">
          You've been successfully unsubscribed from Wise Win Financial newsletters. We're sorry to see you go!
        </p>
        <p style="color:#4b5563;">Changed your mind? <a href="${base}" style="color:#0158a0;">Subscribe again here</a>.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:11px;text-align:center;">© ${new Date().getFullYear()} Wise Win Financial</p>
      </div>
    `,
  })
}

export async function sendManageLink(email: string, token: string) {
  const resend = getResend()
  const from = getFrom()
  const base = getBase()
  const link = `${base}/manage?token=${token}`
  await resend.emails.send({
    from,
    to: email,
    subject: '⚙️ Manage your Wise Win Newsletter subscriptions',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#0158a0;color:white;font-weight:bold;padding:8px 16px;border-radius:8px;">wisewin.ca · 慧盈财富</div>
        </div>
        <h2 style="color:#0a3d6e;font-size:22px;margin-bottom:12px;">Manage your subscriptions</h2>
        <p style="color:#4b5563;line-height:1.6;margin-bottom:24px;">
          Click the button below to update your newsletter preferences. You can add, remove, or unsubscribe from all newsletters.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${link}" style="display:inline-block;background:#e8b400;color:#072848;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;">
            Manage My Subscriptions
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:11px;text-align:center;">
          © ${new Date().getFullYear()} Wise Win Financial · <a href="https://www.wisewin.ca" style="color:#9ca3af;">wisewin.ca</a>
        </p>
      </div>
    `,
  })
}

export async function sendAdminMagicLink(email: string, token: string) {
  const resend = getResend()
  const from = getFrom()
  const base = getBase()
  const link = `${base}/api/admin/verify?token=${token}`
  await resend.emails.send({
    from,
    to: email,
    subject: '🔐 Wise Win Admin Login Link',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
        <h2 style="color:#0a3d6e;">Admin Login</h2>
        <p style="color:#4b5563;line-height:1.6;">Click the button below to log in to the Wise Win Newsletter admin panel. This link expires in 15 minutes.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${link}" style="display:inline-block;background:#0158a0;color:white;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Log In to Admin
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
