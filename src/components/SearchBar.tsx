'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SaasWithCount } from '@/types'

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

const CATEGORIES = ['CRM', 'Project Management', 'HR', 'Accounting', 'Communication', 'Marketing', 'Analytics', 'DevTools']

function AddSaasModal({ initialName, onClose }: { initialName: string; onClose: () => void }) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('CRM')
  const [complaint, setComplaint] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/saas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), website_url: url || null, category, first_complaint: complaint || null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      onClose()
      router.push(`/${data.slug}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-paper border-2 border-ink w-full max-w-md shadow-[8px_8px_0px_rgba(13,13,13,0.15)]">
        {/* Header */}
        <div className="bg-ink px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-paper tracking-wider">ADD TO SAASHATE</h2>
            <p className="font-mono text-[10px] text-paper/40 mt-0.5">The first complaint is always the most righteous.</p>
          </div>
          <button onClick={onClose} className="text-paper/40 hover:text-paper text-xl leading-none transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">
              SaaS Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Salesforce"
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">
              Website URL (optional)
            </label>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink focus:outline-none transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">
              Opening complaint (optional, 140 chars)
            </label>
            <textarea
              value={complaint}
              onChange={e => setComplaint(e.target.value.slice(0, 140))}
              placeholder="Pricing tripled overnight. Couldn't cancel. Support went silent."
              rows={2}
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none resize-none transition-colors"
            />
            <div className="text-right font-mono text-[10px] text-ink/30 mt-0.5">{complaint.length}/140</div>
          </div>

          {error && (
            <div className="font-mono text-xs text-rage border border-rage/30 bg-rage/5 px-3 py-2">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-mono text-xs text-ink/60 hover:text-ink border-2 border-ink/20 hover:border-ink py-3 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-display text-sm tracking-wider text-paper bg-rage hover:bg-ink border-2 border-rage hover:border-ink disabled:opacity-60 py-3 transition-colors uppercase"
            >
              {loading ? 'Adding...' : 'Add & Hate It'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
