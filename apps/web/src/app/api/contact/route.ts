import { site } from '@advertaro/content'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(120),
  email: z.email('Please enter a valid email address.').max(200),
  company: z.string().trim().max(160).optional().default(''),
  project: z.string().trim().max(80).optional().default(''),
  budget: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().min(10, 'Tell us a little more about the project.').max(5000),
  website: z.string().optional(), // honeypot
})

const WINDOW_MS = 5 * 60 * 1000
const recent = new Map<string, number>()

function rateLimited(ip: string) {
  const now = Date.now()
  for (const [key, at] of recent) if (now - at > WINDOW_MS) recent.delete(key)
  const last = recent.get(ip)
  if (last && now - last < WINDOW_MS) return true
  recent.set(ip, now)
  return false
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

async function sendEmail(payload: { to: string; subject: string; html: string; replyTo?: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? `Advertaro <${site.email}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.replyTo,
    }),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' },
      { status: 400 },
    )
  }
  const data = parsed.data

  // Bots fill the hidden field; pretend it worked.
  if (data.website) return NextResponse.json({ ok: true })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'You have just sent a brief. Please wait a few minutes, or email us directly.' },
      { status: 429 },
    )
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set — brief not delivered', {
      name: data.name,
      email: data.email,
    })
    return NextResponse.json(
      { error: `The form is not connected yet. Please email ${site.email}.` },
      { status: 503 },
    )
  }

  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Company', data.company],
    ['Project', data.project],
    ['Budget', data.budget],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v ?? '')}</p>`)
    .join('')

  try {
    await sendEmail({
      to: process.env.CONTACT_TO_EMAIL ?? site.email,
      replyTo: data.email,
      subject: `New brief — ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `${rows}<p><strong>Brief:</strong></p><p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>`,
    })
    await sendEmail({
      to: data.email,
      subject: 'We received your brief — Advertaro',
      html: `<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for telling us about your project. A real person will reply within one business day.</p><p>— The Advertaro team<br/>${site.email}</p>`,
    })
  } catch (error) {
    console.error('[contact] email delivery failed', error)
    return NextResponse.json(
      { error: `We could not send your brief. Please email ${site.email}.` },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}
