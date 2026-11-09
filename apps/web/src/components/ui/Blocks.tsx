import type { Block } from '@advertaro/content'

/** Renders the Portable-Text-shaped content blocks. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`
        switch (block.type) {
          case 'h2':
            return <h2 key={key}>{block.text}</h2>
          case 'h3':
            return <h3 key={key}>{block.text}</h3>
          case 'quote':
            return <blockquote key={key}>{block.text}</blockquote>
          case 'list':
            return (
              <ul key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          default:
            return <p key={key}>{block.text}</p>
        }
      })}
    </>
  )
}
