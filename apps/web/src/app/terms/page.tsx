import { site } from '@advertaro/content'
import type { Metadata } from 'next'
import { LegalPage } from '@/components/sections/shared/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms that apply to using the Advertaro website.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="November 2026"
      body={[
        {
          type: 'p',
          text: `These terms apply to your use of ${site.url}, operated by ${site.legalName}. By using the site you agree to them.`,
        },
        { type: 'h2', text: 'Content' },
        {
          type: 'p',
          text: 'All content on this site — including text, design, graphics and code — belongs to Advertaro or our clients and is protected by copyright. Client names and work are shown with permission. You may not copy or reuse it without written consent.',
        },
        { type: 'h2', text: 'No advice' },
        {
          type: 'p',
          text: 'Articles and other content on this site are for general information. They are not professional advice for your specific situation.',
        },
        { type: 'h2', text: 'Project work' },
        {
          type: 'p',
          text: 'Sending us an enquiry does not create a contract. Any project work is governed by a separate written agreement.',
        },
        { type: 'h2', text: 'Liability' },
        {
          type: 'p',
          text: 'We work to keep this site accurate and available, but we provide it "as is" and are not liable for any loss arising from its use, to the extent permitted by law.',
        },
        { type: 'h2', text: 'Governing law' },
        {
          type: 'p',
          text:
            'These terms are governed by the laws of Sri Lanka. Questions can be sent to ' +
            site.email +
            '.',
        },
      ]}
    />
  )
}
