'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReportModal from '@/components/ReportModal'

export default function Navbar() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="h-1.5 bg-rage w-full" />
      <header className="bg-paper border-b-2 border-ink sticky top-[6px] z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline leading-none">
            <span className="font-display text-[28px] text-ink tracking-wider">SaaS</span>
            <span className="font-display text-[28px] text-rage tracking-wider">Hate</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/" className="text-sm font-semibold text-ink/50 hover:text-ink transition-colors">
              Leaderboard
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-bold tracking-wider text-paper bg-ink px-4 py-2.5 hover:bg-rage transition-colors border-2 border-ink uppercase cursor-pointer"
            >
              Report a SaaS →
            </button>
          </nav>
        </div>
      </header>

      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
    </>
  )
}
