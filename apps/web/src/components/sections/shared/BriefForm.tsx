'use client'

import { budgets, services, site } from '@advertaro/content'
import { type FormEvent, useState } from 'react'

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
    <form className="booking-form" onSubmit={onSubmit} noValidate={false}>
      <div className="form-group">
        <label className="form-label" htmlFor="brief-name">
          <span>{idx()}</span> NAME
        </label>
        <input
          id="brief-name"
          name="name"
          type="text"
          className="form-input"
          placeholder="Your name"
          autoComplete="name"
          required
          maxLength={120}
        />
      </div>

      <div className={extended ? 'form-row' : 'contents'}>
        <div className="form-group">
          <label className="form-label" htmlFor="brief-email">
            <span>{idx()}</span> EMAIL
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            className="form-input"
            placeholder="you@company.com"
            autoComplete="email"
            required
            maxLength={200}
          />
        </div>
        {extended && (
          <div className="form-group">
            <label className="form-label" htmlFor="brief-company">
              <span>{idx()}</span> COMPANY
            </label>
            <input
              id="brief-company"
              name="company"
              type="text"
              className="form-input"
              placeholder="Company name"
              autoComplete="organization"
              maxLength={160}
            />
          </div>
        )}
      </div>

      <fieldset className="form-group">
        <legend className="form-label mb-2.5">
          <span>{idx()}</span> PROJECT
        </legend>
        <div className="project-pills">
          {projectTypes.map((type) => (
            <button
              type="button"
              key={type}
              className={`project-pill${project === type ? ' active' : ''}`}
              aria-pressed={project === type}
              onClick={() => setProject(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      {extended && (
        <div className="form-group">
          <label className="form-label" htmlFor="brief-budget">
            <span>{idx()}</span> ESTIMATED BUDGET
          </label>
          <select
            id="brief-budget"
            name="budget"
            className="form-input form-select"
            defaultValue="Not sure"
          >
            {budgets.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="brief-message">
          <span>{idx()}</span> THE BRIEF
        </label>
        <textarea
          id="brief-message"
          name="message"
          className="form-textarea"
          placeholder="What are you building, by when — and the one number that tells us it worked."
          required
          minLength={10}
          maxLength={5000}
        />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="brief-website">Website</label>
        <input id="brief-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="booking-submit-row">
        <button
          type="submit"
          className={`submit-btn${status.state === 'sent' ? ' success' : ''}`}
          disabled={status.state === 'sending'}
        >
          {status.state === 'sending'
            ? 'Sending…'
            : status.state === 'sent'
              ? 'Brief received — reply within 1 business day ✓'
              : 'Send it →'}
        </button>
        <span className="direct-mail">
          or write: <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
      </div>
      <p
        className={`form-status${status.state === 'error' ? ' error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {status.state === 'error' ? status.message : 'We reply within one business day.'}
      </p>
    </form>
  )
}
