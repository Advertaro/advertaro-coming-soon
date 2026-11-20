// NOTE: stand-in for the eve agent until it is wired up (#1). Answers only repeat published copy.
const ANSWERS: [RegExp, string][] = [
  [
    /budget|price|cost|how much/i,
    'Budgets depend on scope, so we quote after a short call rather than guess. Share a rough range in the brief form and we will tell you honestly what it can cover.',
  ],
  [
    /startup|early.stage|first product/i,
    'Yes. We work with established businesses and with startups shipping their first product. We scope a focused first release, then grow it with you.',
  ],
  [
    /edit|cms|update|content/i,
    'Yes. Every site comes with a headless CMS set up for your content, plus a short training session for your team.',
  ],
]

const FALLBACK =
  'Our AI assistant is still being connected, so I cannot answer that one properly yet. Book a 15 minute call or send a brief below, and a real person will reply within one business day.'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Streams a canned answer word by word, mimicking an agent response. */
export async function* askFaqStub(question: string) {
  const answer = ANSWERS.find(([pattern]) => pattern.test(question))?.[1] ?? FALLBACK
  await sleep(900)
  for (const word of answer.split(' ')) {
    await sleep(28 + Math.random() * 18)
    yield `${word} `
  }
}
