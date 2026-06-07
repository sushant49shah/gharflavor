interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'secondary'
}

// Purpose: Display a small status badge.
// Props:
//   label - text to display.
//   variant - color theme for the badge.
// Usage: Use inside tables, cards, and status lists.
const Badge = ({ label, variant = 'secondary' }: BadgeProps) => {
  const variantClasses: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30',
    warning: 'bg-accent/20 text-accent ring-1 ring-accent/30',
    danger: 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30',
    secondary: 'bg-bg-surface/60 text-text-muted ring-1 ring-border/40',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}

export default Badge
