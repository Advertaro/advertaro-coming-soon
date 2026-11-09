export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase()
}
