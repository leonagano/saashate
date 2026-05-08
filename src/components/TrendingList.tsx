import Link from 'next/link'
import { SaasWithCount } from '@/types'

export default function TrendingList({ items }: { items: SaasWithCount[] }) {
  return (
    <div className="border-2 border-ink/15 overflow-hidden bg-white">
      {items.map((saas, i) => (
        <Link
          key={saas.id}
          href={`/${saas.slug}`}
          className="flex items-center justify-between px-5 py-3.5 border-b border-ink/10 last:border-b-0 hover:bg-hazard transition-colors duration-100 group"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-ink/20 group-hover:text-ink/60 transition-colors w-5 text-right shrink-0">
              {i + 1}
            </span>
            <div className="w-8 h-8 border-2 border-ink/15 group-hover:border-ink flex items-center justify-center text-xs font-display text-ink/40 group-hover:text-ink transition-all bg-cream shrink-0">
              {saas.name[0]}
            </div>
            <div>
              <div className="text-sm font-bold text-ink">{saas.name}</div>
              <div className="font-mono text-[10px] text-ink/35">{saas.category}</div>
            </div>
          </div>
          <div className="font-mono text-sm font-bold text-orange flex items-center gap-1">
            <span>↑</span>
            <span>{saas.hate_count.toLocaleString()}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
