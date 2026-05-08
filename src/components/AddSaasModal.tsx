'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['CRM', 'Project Management', 'HR', 'Accounting', 'Communication', 'Marketing', 'Analytics', 'DevTools']

interface Props {
  initialName?: string
  onClose: () => void
}

export default function AddSaasModal({ initialName = '', onClose }: Props) {
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
        <div className="bg-ink px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-paper tracking-wider">ADD TO SAASHATE</h2>
            <p className="font-mono text-[10px] text-paper/40 mt-0.5">The first complaint is always the most righteous.</p>
          </div>
          <button onClick={onClose} className="text-paper/40 hover:text-paper text-xl leading-none transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">SaaS Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Salesforce"
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">Website URL (optional)</label>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-white border-2 border-ink/25 focus:border-rage px-3 py-2.5 font-mono text-sm text-ink focus:outline-none transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1.5">Opening complaint (optional, 140 chars)</label>
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
            <button type="button" onClick={onClose} className="flex-1 font-mono text-xs text-ink/60 hover:text-ink border-2 border-ink/20 hover:border-ink py-3 transition-colors">
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
