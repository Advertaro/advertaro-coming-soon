import type { Faq } from '@advertaro/content'

/** Native <details> accordion — keyboard accessible without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details className="faq-item" key={item.question} name="faq">
          <summary>
            {item.question}
            <span className="plus" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="answer">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
