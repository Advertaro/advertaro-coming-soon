import type { Post } from './types'

/*
 * DRAFT CONTENT — pre-launch posts from the content strategy (P7-07).
 * Review, edit and set `draft: false` before publishing.
 */

export const posts: Post[] = [
  {
    slug: 'why-we-stopped-building-wordpress-websites',
    title: 'Why we stopped building WordPress websites',
    excerpt:
      'Themes and plugins made sites fast to start and slow to live with. Here is what we build instead, and why it is better for our clients.',
    category: 'Development',
    publishedAt: '2026-11-03',
    readingTime: 6,
    author: 'Madushan Sooriyarathne',
    theme: { base: '#14243b', glow: '#ff4d00', label: 'JOURNAL // NO MORE THEMES' },
    draft: true,
    body: [
      {
        type: 'p',
        text: 'For our first few years, a lot of what we shipped ran on WordPress. It was the default. Clients had heard of it, there was a theme for everything, and a site could be live in days. We stopped doing it, and we have not looked back.',
      },
      { type: 'h2', text: 'The cost shows up later' },
      {
        type: 'p',
        text: 'A themed site is cheap on launch day. The bill arrives afterwards: plugin updates that break the layout, security patches, a page builder that makes every page a little slower, and a design that looks like thousands of other sites using the same theme.',
      },
      {
        type: 'p',
        text: 'Over two or three years, our clients were spending more maintaining those sites than they would have spent building them properly in the first place. And they were still left with something that did not feel like theirs.',
      },
      { type: 'h2', text: 'What we build instead' },
      {
        type: 'p',
        text: 'Today every site we build is custom: designed from a blank page, built with Next.js and React, and connected to a headless CMS. The design and the content are separate, so the team can edit text, images and pages freely without being able to break anything.',
      },
      {
        type: 'list',
        items: [
          'Pages load fast because we ship only the code each page needs.',
          'There is no plugin ecosystem to patch, so the attack surface is tiny.',
          'The design is original, so the site looks like the business — not like a theme.',
          'The site can grow into booking engines, portals and integrations without a rebuild.',
        ],
      },
      { type: 'h2', text: 'Is it more expensive?' },
      {
        type: 'p',
        text: 'Up front, a little. Over the life of the site, almost always less. More importantly, it is the difference between a website you have and a website that works for you.',
      },
      {
        type: 'quote',
        text: 'We would rather build one site that does its job for five years than five sites that each need fixing after one.',
      },
      {
        type: 'p',
        text: 'If you are living with a site that fights you every time you want to change something, we would be happy to talk about what a rebuild would look like.',
      },
    ],
  },
  {
    slug: 'cut-ota-commissions-with-a-direct-booking-website',
    title: 'How boutique hotels can cut OTA commissions with a direct booking website',
    excerpt:
      'Booking platforms are a great way to be found and an expensive way to be booked. A practical guide to winning more direct reservations.',
    category: 'Hospitality',
    publishedAt: '2026-10-20',
    readingTime: 7,
    author: 'Madushan Sooriyarathne',
    theme: { base: '#102a45', glow: '#ff5500', label: 'JOURNAL // BOOK DIRECT' },
    draft: true,
    body: [
      {
        type: 'p',
        text: 'For most boutique hotels and villas, online travel agencies bring in the majority of bookings — and take a significant commission on every one. The platforms are not the enemy. They are very good at being found. The problem is when they become the only way guests book.',
      },
      { type: 'h2', text: 'Guests already look for you' },
      {
        type: 'p',
        text: 'Many travellers find a property on a booking platform and then search for its own website before they book. That moment is the opportunity. If your site is slow, hard to use on a phone, or hides the booking button, they go back to the platform.',
      },
      { type: 'h2', text: 'What a direct booking site needs' },
      {
        type: 'list',
        items: [
          'Availability and rates one tap away on every page.',
          'A booking flow with as few steps as possible.',
          'A clear reason to book direct: best rate, flexible cancellation, a welcome extra.',
          'Photography and copy that sell the stay, not just the room.',
          'Fast loading on mobile networks — most guests are on a phone.',
        ],
      },
      { type: 'h2', text: 'Measure the right thing' },
      {
        type: 'p',
        text: 'The number that matters is the share of bookings that come direct. Track it monthly. Small design changes to the booking path often move it more than a large marketing campaign.',
      },
      {
        type: 'quote',
        text: 'The platforms help guests find you. Your website should help them choose you.',
      },
      {
        type: 'p',
        text: 'If you want an honest view of how your current site performs as a booking channel, send us the link. We will tell you what we would change first.',
      },
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export const sortedPosts = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
