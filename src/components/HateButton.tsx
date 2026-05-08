'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  saasId: string
  saasSlug: string
  initialCount: number
}

type State = 'idle' | 'loading' | 'voted' | 'done'

function wasVoted(slug: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const voted = JSON.parse(localStorage.getItem('saashate_voted') ?? '[]')
    return Array.isArray(voted) && voted.includes(slug)
  } catch {
    return false
  }
}

function markVoted(slug: string) {
  try {
    const voted = JSON.parse(localStorage.getItem('saashate_voted') ?? '[]')
    const arr = Array.isArray(voted) ? voted : []
    if (!arr.includes(slug)) {
      localStorage.setItem('saashate_voted', JSON.stringify([...arr, slug]))
    }
  } catch {}
}

function StampCircle({ count, animKey }: { count: number; animKey: number }) {
  return (
    <div
      key={animKey}
      className="stamp-anim inline-flex flex-col items-center justify-center w-44 h-44 border-[5px] border-rage rounded-full"
    >
      <span className="font-display text-5xl text-rage leading-none">{count.toLocaleString()}</span>
      <span className="font-mono text-[9px] text-rage tracking-[0.28em] uppercase mt-1.5">hate votes</span>
    </div>
  )
}

export default function HateButton({ saasId, saasSlug, initialCount }: Props) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [state, setState] = useState<State>('idle')
  const [stampKey, setStampKey] = useState(0)
  const [reason, setReason] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [profileUrl, setProfileUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Sync voted state from localStorage after hydration
  useEffect(() => {
    if (wasVoted(saasSlug)) setState('done')
  }, [saasSlug])

  async function handleHate() {
    // Belt-and-suspenders: re-check localStorage directly
    if (wasVoted(saasSlug)) {
      setState('done')
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saas_id: saasId }),
      })
      if (res.ok) {
        markVoted(saasSlug)
        setCount(c => c + 1)
        setStampKey(k => k + 1)
        setState('voted')
        router.refresh()
      } else if (res.status === 409) {
        // Server says already voted — sync localStorage and show done state
        markVoted(saasSlug)
        setState('done')
      } else {
        setState('idle')
      }
    } catch {
      setState('idle')
    }
  }

  async function handleSubmitDetails() {
    if (submitted) return
    const cleanX = xHandle.replace(/^@+/, '').trim()
    let cleanUrl = profileUrl.trim()
    if (cleanUrl && !cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl

    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        saas_id: saasId,
        reason: reason.trim() || null,
        x_handle: cleanX || null,
        profile_url: cleanUrl || null,
      }),
    })
    setSubmitted(true)
    setState('done')
    router.refresh()
  }

  if (state === 'done') {
    return (
      <div className="text-center space-y-5">
        <div style={{ transform: 'rotate(-4deg)' }} className="inline-block">
          <div className="inline-flex flex-col items-center justify-center w-44 h-44 border-[5px] border-rage rounded-full">
            <span className="font-display text-5xl text-rage leading-none">{count.toLocaleString()}</span>
            <span className="font-mono text-[9px] text-rage tracking-[0.28em] uppercase mt-1.5">hate votes</span>
          </div>
        </div>
        <div className="slide-up flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-rage/10 border-2 border-rage/30 px-5 py-2">
            <span className="text-rage font-bold">✓</span>
            <span className="font-mono text-sm text-rage">LOGGED. PERMANENT. PUBLIC.</span>
          </div>
          <p className="font-mono text-xs text-ink/40">Your vote is on the record. They can&apos;t delete it.</p>
        </div>
      </div>
    )
  }

  if (state === 'voted') {
    return (
      <div className="space-y-7 text-center">
        <div style={{ transform: 'rotate(-4deg)' }} className="inline-block">
          <StampCircle count={count} animKey={stampKey} />
        </div>

        <div className="slide-up space-y-1">
          <div className="font-display text-2xl text-ink tracking-wide">VOTE CAST. GOOD.</div>
          <p className="font-mono text-xs text-ink/40">Say why. It&apos;ll be public. (optional but therapeutic)</p>
        </div>

        {!submitted ? (
          <div className="max-w-sm mx-auto space-y-3 text-left slide-up">
            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1">
                What did they do to you?
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value.slice(0, 140))}
                placeholder="Pricing tripled overnight. Support went dark. Held our data hostage."
                rows={2}
                className="w-full border-2 border-ink/25 focus:border-rage bg-white px-3 py-2 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none resize-none transition-colors"
              />
              <div className="text-right font-mono text-[10px] text-ink/30 mt-0.5">{reason.length}/140</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1">X Handle</label>
                <div className="flex items-center border-2 border-ink/25 focus-within:border-rage bg-white transition-colors">
                  <span className="pl-2 font-mono text-sm text-ink/40">@</span>
                  <input
                    value={xHandle}
                    onChange={e => setXHandle(e.target.value.replace(/^@+/, ''))}
                    placeholder="yourhandle"
                    className="flex-1 px-2 py-2 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase block mb-1">Website</label>
                <input
                  value={profileUrl}
                  onChange={e => setProfileUrl(e.target.value)}
                  placeholder="yoursite.com"
                  className="w-full border-2 border-ink/25 focus:border-rage bg-white px-3 py-2 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setState('done')}
                className="flex-1 font-mono text-xs text-ink/50 hover:text-ink border-2 border-ink/20 hover:border-ink py-2.5 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitDetails}
                className="flex-1 font-mono text-xs font-bold bg-ink text-paper hover:bg-rage border-2 border-ink hover:border-rage py-2.5 transition-colors uppercase tracking-wider"
              >
                Put It on Record →
              </button>
            </div>
          </div>
        ) : (
          <p className="font-mono text-sm text-ink/40 slide-up">Filed. Permanent. They can&apos;t make it go away.</p>
        )}
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div style={{ transform: 'rotate(-4deg)' }} className="inline-block">
        <div className="inline-flex flex-col items-center justify-center w-44 h-44 border-[5px] border-rage rounded-full">
          <span className="font-display text-5xl text-rage leading-none">{count.toLocaleString()}</span>
          <span className="font-mono text-[9px] text-rage tracking-[0.28em] uppercase mt-1.5">hate votes</span>
        </div>
      </div>

      <button
        onClick={handleHate}
        disabled={state === 'loading'}
        className={`w-full font-display text-3xl tracking-wider text-paper bg-rage hover:bg-ink border-4 border-rage hover:border-ink py-6 transition-all active:scale-[0.98] disabled:opacity-70 ${
          state === 'loading' ? 'shake rage-pulse' : ''
        }`}
      >
        {state === 'loading' ? 'FILING...' : '🤬 I HATE THIS SAAS'}
      </button>

      <p className="font-mono text-xs text-ink/30">Anonymous. No signup. No BS.</p>
    </div>
  )
}
