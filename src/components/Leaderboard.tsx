'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SaasWithCount, TimeFilter } from '@/types'

const TABS: { label: string; value: TimeFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'All Time', value: 'all' },
]

interface Props {
  today: SaasWithCount[]
  week: SaasWithCount[]
  all: SaasWithCount[]
}

export default function Leaderboard({ today, week, all }: Props) {
  const [active, setActive] = useState<TimeFilter>('all')
  const data = active === 'today' ? today : active === 'week' ? week : all

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-6 w-fit border-2 border-ink">
        {TABS.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`px-6 py-2.5 font-display text-sm tracking-widest transition-colors ${
              i < TABS.length - 1 ? 'border-r-2 border-ink' : ''
            } ${
              active === tab.value
                ? 'bg-ink text-paper'
                : 'bg-paper text-ink hover:bg-hazard'
            }`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border-2 border-ink overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-ink">
              <th className="text-left px-5 py-3.5 font-display text-xs tracking-[0.18em] text-paper w-14">RANK</th>
              <th className="text-left px-5 py-3.5 font-display text-xs tracking-[0.18em] text-paper">SAAS</th>
              <th className="text-left px-5 py-3.5 font-display text-xs tracking-[0.18em] text-paper hidden sm:table-cell">CATEGORY</th>
              <th className="text-right px-5 py-3.5 font-display text-xs tracking-[0.18em] text-paper">HATE VOTES</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center font-mono text-sm text-ink/40">
                  No hate registered for this period yet.
                </td>
              </tr>
            )}
            {data.map((saas, i) => (
              <tr
                key={saas.id}
                className="border-b border-ink/15 hover:bg-hazard transition-colors duration-100 group"
              >
                <td className="px-5 py-4">
                  <span
                    className={`font-display text-2xl leading-none ${
                      i === 0 ? 'text-rage' : i === 1 ? 'text-ink/70' : i === 2 ? 'text-orange' : 'text-ink/25'
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/${saas.slug}`} className="flex items-center gap-3">
                    <div className="w-9 h-9 border-2 border-ink/20 group-hover:border-ink flex items-center justify-center text-sm font-display text-ink/50 group-hover:text-ink shrink-0 transition-all bg-cream">
                      {saas.name[0]}
                    </div>
                    <span className="text-sm font-bold text-ink/80 group-hover:text-ink transition-colors">
                      {saas.name}
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="font-mono text-xs text-ink/40 bg-ink/5 px-2 py-1 border border-ink/10">
                    {saas.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-display text-lg text-rage tracking-wider">
                    {saas.hate_count.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
