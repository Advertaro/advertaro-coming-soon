import { caseStudies } from './case-studies'
import type { TeamMember, Testimonial } from './types'

/* Team profiles beyond the founder are pending photography and bios (P7-05, P7-06). */
export const team: TeamMember[] = [
  {
    name: 'Madushan Sooriyarathne',
    role: 'Co-Founder & Director',
    bio: 'Started freelancing in 2018 and founded Advertaro in 2019. Leads strategy and engineering on every project.',
    linkedinUrl: 'https://linkedin.com/company/advertaro-creative-agency',
    theme: { base: '#172334', glow: '#ff4d00', label: 'ADVERTARO // FOUNDER' },
  },
]

/** Featured testimonials, derived from case-study quotes. Drafts until approved. */
export const testimonials: Testimonial[] = caseStudies
  .filter((study) => study.featured && study.quote)
  .map((study) => ({
    // biome-ignore lint/style/noNonNullAssertion: filtered above
    ...study.quote!,
    project: study.slug,
    file: `${study.slug.replaceAll('-', '_')}_live · ${study.year}`,
    theme: study.theme,
    draft: study.draft,
  }))
