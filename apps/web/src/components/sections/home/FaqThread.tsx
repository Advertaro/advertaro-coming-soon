'use client'

import type { Faq } from '@advertaro/content'
import { useRef, useState } from 'react'
import { askFaqStub } from '@/lib/faq-answer-stub'
import { FaqAskField } from './FaqAskField'
import { FaqMessage } from './FaqMessage'

type AskedFaq = { id: number; question: string; answer: string; isStreaming: boolean }

type FaqThreadProps = {
  items: Faq[]
  examples: readonly string[]
  founder: { initials: string; background: string }
}

/** FAQ chat thread. Asked questions join it for the visit and stream an AI answer. */
export function FaqThread({ items, examples, founder }: FaqThreadProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [asked, setAsked] = useState<AskedFaq[]>([])
  const nextId = useRef(0)
  const isBusy = asked.some((item) => item.isStreaming)

  const toggle = (key: string) => setOpenKey((current) => (current === key ? null : key))

  const update = (id: number, change: (item: AskedFaq) => AskedFaq) =>
    setAsked((list) => list.map((item) => (item.id === id ? change(item) : item)))

  async function handleAsk(question: string) {
    const id = nextId.current++
    setAsked((list) => [...list, { id, question, answer: '', isStreaming: true }])
    setOpenKey(`ai-${id}`)
    // TODO(madushan): replace askFaqStub with the eve agent stream (#1)
    for await (const chunk of askFaqStub(question)) {
      update(id, (item) => ({ ...item, answer: item.answer + chunk }))
    }
    update(id, (item) => ({ ...item, isStreaming: false }))
  }

  return (
    <div>
      <div className="grid gap-3.5">
        {items.map((item, index) => (
          <FaqMessage
            key={item.question}
            question={item.question}
            answer={item.answer}
            founder={founder}
            isOpen={openKey === `faq-${index}`}
            onToggle={() => toggle(`faq-${index}`)}
          />
        ))}
        {asked.map((item) => (
          <FaqMessage
            key={item.id}
            question={item.question}
            answer={item.answer}
            founder={founder}
            isAi
            isStreaming={item.isStreaming}
            isOpen={openKey === `ai-${item.id}`}
            onToggle={() => toggle(`ai-${item.id}`)}
          />
        ))}
      </div>
      <FaqAskField
        examples={examples}
        isBusy={isBusy}
        onAsk={(question) => void handleAsk(question)}
      />
    </div>
  )
}
