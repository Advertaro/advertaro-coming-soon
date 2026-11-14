'use client'

import { budgets, services, site } from '@advertaro/content'
import { cn } from '@advertaro/ui'
import { type FormEvent, useState } from 'react'

const GROUP_CLASS = 'flex flex-col gap-2.5'
const LABEL_CLASS =
  'font-sans text-[11px] tracking-[0.14em] text-ink-secondary [&_span]:mr-1.5 [&_span]:text-accent'
const FIELD_CLASS =
  'w-full rounded-[10px] border border-line bg-bg-input px-4 py-3.5 text-[14.5px] text-white transition-[border-color] duration-200 ease-[ease] focus:border-accent'
const TEXTAREA_CLASS = cn(FIELD_CLASS, 'min-h-[110px] resize-y')
const SELECT_CLASS = cn(
  FIELD_CLASS,
  'appearance-none bg-no-repeat pr-10 bg-[position:calc(100%_-_20px)_50%,calc(100%_-_15px)_50%] bg-[size:5px_5px] [&_option]:bg-bg-elevated',
  'bg-[linear-gradient(45deg,transparent_50%,var(--color-ink-secondary)_50%),linear-gradient(135deg,var(--color-ink-secondary)_50%,transparent_50%)]',
)
const PILL_CLASS =
  'cursor-pointer rounded-full border border-line bg-bg-input px-3.5 py-[9px] text-[13px] text-ink-secondary transition-all duration-200 ease-[ease] hover:border-accent hover:bg-accent/15 hover:text-white'

const projectTypes = [...services.map((s) => s.shortTitle), 'Something else']

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string }

/** The prototype's numbered brief form, wired to /api/contact. */
export function BriefForm({ extended = false }: { extended?: boolean }) {
  const [project, setProject] = useState(projectTypes[1] ?? '')
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus({ state: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, project }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Something went wrong. Please email us instead.')
      form.reset()
      setStatus({ state: 'sent' })
    } catch (error) {
      setStatus({ state: 'error', message: (error as Error).message })
    }
  }

  let n = 0
  const idx = () => String(++n).padStart(2, '0')

  return (
    <form
      className="flex flex-col gap-6 rounded-[18px] border border-line bg-bg-card p-6 sm:p-9"
      onSubmit={onSubmit}
      noValidate={false}
    >
      <div className={GROUP_CLASS}>
        <label className={LABEL_CLASS} htmlFor="brief-name">
          <span>{idx()}</span> NAME
        </label>
        <input
          id="brief-name"
          name="name"
          type="text"
          className={FIELD_CLASS}
          placeholder="Your name"
          autoComplete="name"
          required
          maxLength={120}
        />
      </div>

      <div className={extended ? 'grid grid-cols-[1fr] gap-5 md:grid-cols-[1fr_1fr]' : 'contents'}>
        <div className={GROUP_CLASS}>
          <label className={LABEL_CLASS} htmlFor="brief-email">
            <span>{idx()}</span> EMAIL
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            className={FIELD_CLASS}
            placeholder="you@company.com"
            autoComplete="email"
            required
            maxLength={200}
          />
        </div>
        {extended && (
          <div className={GROUP_CLASS}>
            <label className={LABEL_CLASS} htmlFor="brief-company">
              <span>{idx()}</span> COMPANY
            </label>
            <input
              id="brief-company"
              name="company"
              type="text"
              className={FIELD_CLASS}
              placeholder="Company name"
              autoComplete="organization"
              maxLength={160}
            />
          </div>
        )}
      </div>

      <fieldset className={GROUP_CLASS}>
        <legend className={cn(LABEL_CLASS, 'mb-2.5')}>
          <span>{idx()}</span> PROJECT
        </legend>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <button
              type="button"
              key={type}
              className={cn(
                PILL_CLASS,
                project === type && 'border-accent bg-accent/15 text-white',
              )}
              aria-pressed={project === type}
              onClick={() => setProject(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      {extended && (
        <div className={GROUP_CLASS}>
          <label className={LABEL_CLASS} htmlFor="brief-budget">
            <span>{idx()}</span> ESTIMATED BUDGET
          </label>
          <select id="brief-budget" name="budget" className={SELECT_CLASS} defaultValue="Not sure">
            {budgets.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
        </div>
      )}

      <div className={GROUP_CLASS}>
        <label className={LABEL_CLASS} htmlFor="brief-message">
          <span>{idx()}</span> THE BRIEF
        </label>
        <textarea
          id="brief-message"
          name="message"
          className={TEXTAREA_CLASS}
          placeholder="What are you building, by when — and the one number that tells us it worked."
          required
          minLength={10}
          maxLength={5000}
        />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="absolute -left-[10000px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="brief-website">Website</label>
        <input id="brief-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          className={cn(
            'cursor-pointer rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition-[background-color,translate] duration-200 ease-[ease] hover:-translate-y-px disabled:cursor-progress disabled:opacity-70',
            status.state === 'sent'
              ? 'bg-success hover:bg-success'
              : 'bg-accent shadow-[0_6px_24px] shadow-accent/35 hover:bg-accent-hover',
          )}
          disabled={status.state === 'sending'}
        >
          {status.state === 'sending'
            ? 'Sending…'
            : status.state === 'sent'
              ? 'Brief received — reply within 1 business day ✓'
              : 'Send it →'}
        </button>
        <span className="font-sans text-[12px] text-ink-secondary [&_a]:border-b [&_a]:border-accent [&_a]:pb-0.5 [&_a]:text-white">
          or write: <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
      </div>
      <p
        className={cn(
          'font-sans text-[11.5px] tracking-[0.08em]',
          status.state === 'error' ? 'text-danger' : 'text-ink-secondary',
        )}
        role="status"
        aria-live="polite"
      >
        {status.state === 'error' ? status.message : 'We reply within one business day.'}
      </p>
    </form>
  )
}
