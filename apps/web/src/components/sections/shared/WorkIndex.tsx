'use client'

import { type CaseStudy, getServiceTitle, type ServiceSlug, services } from '@advertaro/content'
import { useState } from 'react'
import { WorkCard } from './WorkCard'

/** Filterable case-study grid for /work. */
export function WorkIndex({ studies }: { studies: CaseStudy[] }) {
  const [filter, setFilter] = useState<ServiceSlug | 'all'>('all')
  const visible = filter === 'all' ? studies : studies.filter((s) => s.services.includes(filter))

  return (
    <>
      <fieldset className="filter-bar">
        <legend className="sr-only">Filter by service</legend>
        {(['all', ...services.map((s) => s.slug)] as const).map((slug) => (
          <button
            type="button"
            key={slug}
            className={`project-pill${filter === slug ? ' active' : ''}`}
            aria-pressed={filter === slug}
            onClick={() => setFilter(slug)}
          >
            {slug === 'all' ? 'All work' : getServiceTitle(slug)}
          </button>
        ))}
      </fieldset>
      <div className="work-grid">
        {visible.map((study, i) => (
          <WorkCard
            key={study.slug}
            study={study}
            index={studies.indexOf(study)}
            reverse={i % 2 === 1}
            showOutcome
            className={i === 0 && filter === 'all' ? 'wide' : undefined}
          />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="mono-label py-16">Nothing here yet — check back soon.</p>
      )}
    </>
  )
}
