/** Orange pill marking content answered by AI. */
export function AiBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 px-2.25 py-0.75 font-sans text-[10px] font-normal tracking-[0.14em] text-accent-pale before:text-accent before:content-['✦']">
      {children}
    </span>
  )
}
