'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SaasWithCount } from '@/types'
import AddSaasModal from '@/components/AddSaasModal'

interface Props {
  onClose: () => void
}

export default function ReportModal({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SaasWithCount[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  // Auto-focus on open
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      setResults(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  function handleSelect(slug: string) {
    onClose()
    router.push(`/${slug}`)
  }

  const noMatch = query.trim().length > 1 && !loading && results.length === 0

  if (showAdd) {
    return <AddSaasModal initialName={query} onClose={onClose} />
  }

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl shadow-[8px_8px_0px_rgba(13,13,13,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ink px-5 py-3.5 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.22em] text-paper/40 uppercase">
            Search a SaaS to vote — or report a missing one
          </span>
          <button onClick={onClose} className="text-paper/40 hover:text-paper transition-colors leading-none text-lg">✕</button>
        </div>

        {/* Search input */}
        <div className="relative bg-white border-x-2 border-ink">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jira, Salesforce, SAP..."
            className="w-full bg-white px-5 py-4 font-mono text-base text-ink placeholder-ink/30 focus:outline-none"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-rage border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white border-x-2 border-b-2 border-ink divide-y divide-ink/10">
            {results.map(saas => (
              <button
                key={saas.id}
                onClick={() => handleSelect(saas.slug)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-hazard transition-colors duration-100 group text-left"
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
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-rage">{saas.hate_count.toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-ink/30">votes →</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No match — inline add prompt */}
        {noMatch && (
          <div className="bg-cream border-x-2 border-b-2 border-ink px-5 py-5 space-y-3">
            <p className="font-mono text-sm text-ink/60">
              <span className="font-bold text-ink">&ldquo;{query}&rdquo;</span> hasn&apos;t been called out yet.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full font-display text-base tracking-wider text-paper bg-rage hover:bg-ink border-2 border-rage hover:border-ink py-3 transition-colors"
            >
              BE THE FIRST TO HATE {query.toUpperCase()} →
            </button>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="bg-white border-x-2 border-b-2 border-ink px-5 py-4">
            <p className="font-mono text-xs text-ink/30">Type to search 20+ SaaS products — or add a missing one.</p>
          </div>
        )}
      </div>
    </div>
  )
}
