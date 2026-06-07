const statusStyles: Record<string, string> = {
  pending: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  confirmed: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
  processing: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
  shipped: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300',
  delivered: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  cancelled: 'border-red-500/30 bg-red-500/15 text-red-300',
  refunded: 'border-slate-400/30 bg-slate-400/15 text-slate-300',
}

export const getOrderStatusClasses = (status: string) => (
  statusStyles[status.toLowerCase()] || 'border-border bg-bg-surface/60 text-text-muted'
)
