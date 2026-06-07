interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

// Purpose: Display a friendly placeholder when list content is empty.
// Props:
//   title - headline text.
//   description - supporting message.
//   actionLabel - optional button label.
//   onAction - optional callback for the button.
// Usage: Use when a section has no results or mock records.
const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-border/40 bg-bg-surface/20 p-10 text-center text-text-muted">
      <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Nothing here yet</p>
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-muted">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-6 rounded-full bg-primary hover:bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
