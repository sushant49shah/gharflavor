import type { ReactNode } from 'react'
import { TrendingUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  trend: string
  icon: ReactNode
}

const StatsCard = ({
  title,
  value,
  trend,
  icon,
}: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/4 to-white/2 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ">

      {/* Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/3 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-md uppercase tracking-[0.2em] text-text-muted">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-text-base">
            {value}
          </h3>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
          <TrendingUp size={14} />
          {trend}
        </div>
      </div>

      {/* Mini chart placeholder */}
      <div className="mt-8 flex h-12 items-end gap-1">
        <div className="h-3 w-full rounded-full bg-primary/20" />
        <div className="h-5 w-full rounded-full bg-primary/25" />
        <div className="h-7 w-full rounded-full bg-primary/30" />
        <div className="h-4 w-full rounded-full bg-primary/20" />
        <div className="h-9 w-full rounded-full bg-primary/40" />
        <div className="h-8 w-full rounded-full bg-primary/30" />
        <div className="h-12 w-full rounded-full bg-primary/50" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
            {icon}
          </div>

          <span className="text-sm text-text-muted">
            Last 30 days
          </span>
        </div>

        <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
          View Details →
        </button>
      </div>
    </div>
  )
}

export default StatsCard