'use client'

import { type CaseStudy, getServiceTitle, type ServiceSlug, services } from '@advertaro/content'
import { cn, MonoLabel } from '@advertaro/ui'
import { useState } from 'react'
import { WorkCard } from './WorkCard'

const PILL_CLASS =
  'cursor-pointer rounded-full border border-line bg-bg-input px-3.5 py-[9px] text-[13px] text-ink-secondary transition-all duration-200 ease-[ease] hover:border-accent hover:bg-accent/15 hover:text-white'

/** Filterable case-study grid for /work. */
export function WorkIndex({ studies }: { studies: CaseStudy[] }) {
  const [filter, setFilter] = useState<ServiceSlug | 'all'>('all')
  const visible = filter === 'all' ? studies : studies.filter((s) => s.services.includes(filter))

  return (
    <>
      <fieldset className="mb-9 flex flex-wrap gap-2">
        <legend className="sr-only">Filter by service</legend>
        {(['all', ...services.map((s) => s.slug)] as const).map((slug) => (
          <button
            type="button"
            key={slug}
            className={cn(PILL_CLASS, filter === slug && 'border-accent bg-accent/15 text-white')}
            aria-pressed={filter === slug}
            onClick={() => setFilter(slug)}
          >
            {slug === 'all' ? 'All work' : getServiceTitle(slug)}
          </button>
        ))}
      </fieldset>
      <div className="grid grid-cols-[1fr] gap-7 md:grid-cols-[repeat(2,1fr)]">
        {visible.map((study, i) => (
          <WorkCard
            key={study.slug}
            study={study}
            index={studies.indexOf(study)}
            reverse={i % 2 === 1}
            showOutcome
            className={i === 0 && filter === 'all' ? 'col-span-full md:aspect-[16/7]' : undefined}
          />
        ))}
      </div>
      {visible.length === 0 && (
        <MonoLabel as="p" className="py-16">
          Nothing here yet — check back soon.
        </MonoLabel>
      )}
    </>
  )
}
