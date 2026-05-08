'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SaasWithCount } from '@/types'
import AddSaasModal from '@/components/AddSaasModal'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SaasWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(slug: string) {
    setOpen(false)
    setQuery('')
    router.push(`/${slug}`)
  }

  const noMatch = query.trim().length > 0 && !loading && results.length === 0

  return (
    <>
      <div ref={ref} className="relative w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query && setOpen(true)}
            placeholder="Search any SaaS — Jira, Salesforce, Slack..."
            className="w-full bg-white border-2 border-ink px-5 py-3.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-rage transition-colors pr-12"
          />
          {loading ? (

            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-rage border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 text-lg pointer-events-none">→</span>
          )}
        </div>

        {open && (
          <div className="absolute top-full mt-0 w-full bg-white border-2 border-ink border-t-0 overflow-hidden z-50 shadow-[4px_4px_0px_rgba(13,13,13,0.15)]">
            {results.map(saas => (
              <button
                key={saas.id}
                onClick={() => handleSelect(saas.slug)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-hazard transition-colors text-left group border-b border-ink/10 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-ink/15 group-hover:border-ink bg-cream flex items-center justify-center text-xs font-display text-ink/50 group-hover:text-ink shrink-0 transition-all">
                    {saas.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">{saas.name}</div>
                    <div className="font-mono text-[10px] text-ink/35">{saas.category}</div>
                  </div>
                </div>
                <div className="font-display text-sm text-rage">
                  {saas.hate_count.toLocaleString()}
                </div>
              </button>
            ))}

            {noMatch && (
              <div className="px-5 py-5">
                <div className="font-mono text-sm text-ink/60 mb-4">
                  <span className="font-bold text-ink">&ldquo;{query}&rdquo;</span> hasn&apos;t been called out yet.
                </div>
                <button
                  onClick={() => { setOpen(false); setShowAddModal(true) }}
                  className="w-full font-display text-base tracking-wider text-paper bg-rage hover:bg-ink border-2 border-rage hover:border-ink py-3 transition-colors"
                >
                  BE THE FIRST TO HATE {query.toUpperCase()} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSaasModal initialName={query} onClose={() => setShowAddModal(false)} />
      )}
    </>
  )
}

