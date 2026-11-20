import { cn } from '@advertaro/ui'
import { useId } from 'react'
import { AiBadge } from './AiBadge'

type FaqMessageProps = {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  founder: { initials: string; background: string }
  isAi?: boolean
  isStreaming?: boolean
}

const MOTION = 'duration-450 ease-out-expo motion-reduce:transition-none'

/** Chat-style Q&A: a question bubble that opens an answer bubble beside an avatar. */
export function FaqMessage({
  question,
  answer,
  isOpen,
  onToggle,
  founder,
  isAi = false,
  isStreaming = false,
}: FaqMessageProps) {
  const id = useId()
  const isThinking = isStreaming && !answer

  return (
    <div
      className={cn('group grid', isAi && 'animate-faq-rise motion-reduce:animate-none')}
      data-open={isOpen || undefined}
    >
      <button
        type="button"
        id={`${id}-question`}
        aria-expanded={isOpen}
        aria-controls={`${id}-answer`}
        onClick={onToggle}
        className={cn(
          'inline-flex max-w-full cursor-pointer items-center gap-3 justify-self-start rounded-[26px_26px_26px_6px] bg-bg-card-hover px-5.5 py-4 text-left text-[length:clamp(16px,1.5vw,19px)] tracking-[-0.01em] transition-[background-color,border-radius] hover:bg-line sm:ml-13',
          'group-data-open:rounded-[26px_26px_6px_26px] group-data-open:bg-accent/14',
          MOTION,
        )}
      >
        <span>{question}</span>
        {isAi && <AiBadge>AI</AiBadge>}
        <span
          aria-hidden="true"
          className={cn(
            'text-xl/none text-accent transition-[rotate] group-data-open:rotate-45',
            MOTION,
          )}
        >
          +
        </span>
      </button>

      {/* grid-rows 0fr -> 1fr animates the height both ways without measuring. */}
      <section
        id={`${id}-answer`}
        aria-labelledby={`${id}-question`}
        inert={!isOpen}
        className={cn(
          'grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] group-data-open:grid-rows-[1fr] group-data-open:opacity-100',
          MOTION,
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex max-w-160 items-end gap-3.5 pt-2 pb-1.5">
            <span
              aria-hidden="true"
              className={cn(
                'grid size-9.5 shrink-0 place-items-center rounded-full border font-display font-bold',
                isAi
                  ? 'border-accent/50 bg-accent/15 text-base text-accent'
                  : 'border-line-strong text-xs',
              )}
              style={isAi ? undefined : { background: founder.background }}
            >
              {isAi ? '✦' : founder.initials}
            </span>
            <p
              aria-live={isAi ? 'polite' : undefined}
              className={cn(
                'origin-top-left -translate-y-2.5 scale-96 rounded-[6px_26px_26px_26px] bg-ink-bright px-5.5 py-4.5 text-[15.5px] leading-[1.6] text-bg transition-transform group-data-open:translate-y-0 group-data-open:scale-100',
                MOTION,
                isStreaming &&
                  !isThinking &&
                  "after:ml-0.5 after:animate-caret-blink after:text-accent after:content-['▍'] motion-reduce:after:animate-none",
              )}
            >
              {isThinking ? (
                <span className="inline-flex gap-1.25 py-1.5" role="status" aria-label="Thinking">
                  <span className="size-1.75 animate-typing-dot rounded-full bg-ink-muted motion-reduce:animate-none" />
                  <span className="size-1.75 animate-typing-dot rounded-full bg-ink-muted [animation-delay:150ms] motion-reduce:animate-none" />
                  <span className="size-1.75 animate-typing-dot rounded-full bg-ink-muted [animation-delay:300ms] motion-reduce:animate-none" />
                </span>
              ) : (
                answer
              )}
            </p>
          </div>
          {isAi && (
            <p className="mt-1 mb-1 ml-13 text-xs text-ink-muted">
              ✦ Answered by AI · may be imperfect
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
