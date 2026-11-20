import { cn } from '@advertaro/ui'
import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { AiBadge } from './AiBadge'

type FaqAskFieldProps = {
  examples: readonly string[]
  isBusy: boolean
  onAsk: (question: string) => void
}

const ROTATE_MS = 3200
const LEAVE_MS = 300

/** Free-text question field under the FAQ thread, with a rotating example placeholder. */
export function FaqAskField({ examples, isBusy, onAsk }: FaqAskFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const wasBusy = useRef(false)
  const [value, setValue] = useState('')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const hasValue = value !== ''

  useEffect(() => {
    if (hasValue) return
    let swap: ReturnType<typeof setTimeout> | undefined
    const interval = setInterval(() => {
      if (document.hidden) return
      setIsLeaving(true)
      swap = setTimeout(() => {
        setExampleIndex((index) => (index + 1) % examples.length)
        setIsLeaving(false)
      }, LEAVE_MS)
    }, ROTATE_MS)
    return () => {
      clearInterval(interval)
      clearTimeout(swap)
    }
  }, [hasValue, examples.length])

  // The input is disabled while an answer streams, which drops focus; hand it back after.
  useEffect(() => {
    if (wasBusy.current && !isBusy) inputRef.current?.focus()
    wasBusy.current = isBusy
  }, [isBusy])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = value.trim()
    if (!question || isBusy) return
    setValue('')
    onAsk(question)
  }

  return (
    <form className="mt-9 sm:ml-13" onSubmit={handleSubmit}>
      <div className="mb-3.5 flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className="font-display text-[length:clamp(17px,1.6vw,21px)] font-semibold tracking-[-0.015em]"
        >
          Didn't find your question?
        </label>
        <AiBadge>AI ANSWERED</AiBadge>
      </div>

      <div className="relative flex items-center gap-2.5 rounded-full border border-line-strong bg-bg-input py-1.5 pr-1.5 pl-5.5 transition-[border-color,box-shadow] duration-200 ease-[ease] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/12">
        {!hasValue && (
          <span
            key={exampleIndex}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 right-30 left-5.5 flex animate-faq-rise items-center text-base text-ink-muted transition-[opacity,translate] duration-300 ease-out-expo motion-reduce:animate-none motion-reduce:transition-none',
              isLeaving && '-translate-y-2.5 opacity-0',
            )}
          >
            <span className="min-w-0 truncate">{examples[exampleIndex]}</span>
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          name="question"
          maxLength={300}
          autoComplete="off"
          value={value}
          disabled={isBusy}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
        />
        <button
          type="submit"
          disabled={isBusy || !value.trim()}
          className="h-11.5 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Ask ↵
        </button>
      </div>

      <p className="mx-1 mt-3 text-xs leading-normal text-ink-muted">
        ✦ Answered by AI from our published info, so it can be imperfect. For specifics,{' '}
        <a href="#contact" className="text-accent-soft underline underline-offset-3">
          book a 15 min call
        </a>
        . Your question joins the list above for this visit only.
      </p>
    </form>
  )
}
