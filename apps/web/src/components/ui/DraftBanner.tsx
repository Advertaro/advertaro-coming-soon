/** Visible marker on content that still needs client sign-off. Removed by setting `draft: false`. */
export function DraftBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 border-b border-accent/35 bg-accent/10 px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] text-accent-pale uppercase md:px-8"
      role="note"
    >
      <span aria-hidden="true">●</span>
      {children}
    </div>
  )
}
