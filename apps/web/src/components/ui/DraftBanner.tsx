/** Visible marker on content that still needs client sign-off. Removed by setting `draft: false`. */
export function DraftBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="draft-banner" role="note">
      <span aria-hidden="true">●</span>
      {children}
    </div>
  )
}
