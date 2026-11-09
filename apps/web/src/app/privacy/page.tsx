import { site } from '@advertaro/content'
import type { Metadata } from 'next'
import { LegalPage } from '@/components/sections/shared/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Advertaro collects, uses and protects personal information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      body={[
        {
          type: 'p',
          text: `${site.legalName} ("Advertaro", "we", "us") respects your privacy. This policy explains what personal information we collect through ${site.url}, why we collect it, and how we look after it.`,
        },
        { type: 'h2', text: 'What we collect' },
        {
          type: 'list',
          items: [
            'Information you send us through the contact form or by email: your name, email address, company and the details of your project.',
            'Anonymous usage data collected by Vercel Analytics, such as pages visited and device type. This does not use cookies and does not identify you personally.',
          ],
        },
        { type: 'h2', text: 'How we use it' },
        {
          type: 'p',
          text: 'We use the information you send us only to reply to your enquiry and, if we work together, to deliver the project. We use analytics data to understand how the site is used and to improve it. We do not sell your information or use it for advertising.',
        },
        { type: 'h2', text: 'Who we share it with' },
        {
          type: 'p',
          text: 'We use a small number of service providers to run this site and handle email, such as our hosting and email delivery providers. They process data only on our behalf.',
        },
        { type: 'h2', text: 'How long we keep it' },
        {
          type: 'p',
          text: 'We keep enquiries for as long as needed to respond and for a reasonable period afterwards, unless we start working together, in which case project records are kept for the duration of our relationship and as required by law.',
        },
        { type: 'h2', text: 'Your rights' },
        {
          type: 'p',
          text: `You can ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. Email ${site.email} and we will respond promptly.`,
        },
        { type: 'h2', text: 'Contact' },
        { type: 'p', text: `Questions about this policy can be sent to ${site.email}.` },
      ]}
    />
  )
}
