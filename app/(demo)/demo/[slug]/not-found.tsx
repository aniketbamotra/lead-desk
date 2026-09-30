// Shown for a switched-off link, a lost lead or a mistyped address. Plain
// and neutral: the visitor may be the prospect or one of their patients.
export default function DemoNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 text-center">
      <div className="grid max-w-md gap-3">
        <h1 className="text-title font-normal tracking-[-0.01em]">This concept is no longer available</h1>
        <p className="text-control font-normal text-ink-muted">
          The link may have expired. If someone shared it with you, ask them for a new one.
        </p>
      </div>
    </main>
  )
}
