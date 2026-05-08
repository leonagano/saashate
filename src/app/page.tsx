import { getLeaderboard, getTrending, getRecentComplaints } from '@/lib/data'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import Leaderboard from '@/components/Leaderboard'
import TrendingList from '@/components/TrendingList'
import { ComplaintCard } from '@/components/ComplaintCard'

export const revalidate = 60

export default async function HomePage() {
  const [today, week, all, trending, complaints] = await Promise.all([
    getLeaderboard('today'),
    getLeaderboard('week'),
    getLeaderboard('all'),
    getTrending(),
    getRecentComplaints(),
  ])

  const totalVotes = all.reduce((s, x) => s + x.hate_count, 0)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Hero */}
      <section className="border-b-2 border-ink bg-paper">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border-2 border-ink/20 px-4 py-2 mb-8 bg-cream">
              <span className="font-mono text-[10px] tracking-[0.22em] text-ink/50 uppercase">
                ⚠ Public Complaint Board — Anonymous. Permanent. Free.
              </span>
            </div>

            {/* Giant title */}
            <h1 className="font-display leading-[0.88] mb-6" style={{ fontSize: 'clamp(80px, 16vw, 160px)' }}>
              <span className="text-ink block">SaaS</span>
              <span className="text-rage block">Hate.</span>
            </h1>

            {/* Red rule */}
            <div className="w-20 h-1.5 bg-rage mb-7" />

            {/* Subheadline */}
            <p className="font-mono text-base sm:text-lg text-ink/55 mb-10 max-w-lg leading-relaxed">
              Your software is bad. Now it&apos;s on the record.<br />
              No fake reviews. No 3-star compromise. Just rage.
            </p>

            {/* Search */}
            <div className="max-w-xl">
              <SearchBar />
            </div>

            {/* Live count */}
            <div className="mt-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-rage rounded-full animate-pulse inline-block" />
              <span className="font-mono text-xs text-ink/40">
                {totalVotes.toLocaleString()} complaints on the public record
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Leaderboard */}
        <section>
          <div className="flex items-end gap-4 mb-2">
            <h2 className="font-display text-6xl sm:text-8xl text-ink leading-none">MOST HATED</h2>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-rage rounded-full animate-pulse" />
              <span className="font-mono text-[10px] text-ink/35 tracking-wider uppercase">live</span>
            </div>
          </div>
          <p className="font-mono text-xs text-ink/35 mb-8">These companies earned it. Updated in real time.</p>
          <Leaderboard today={today} week={week} all={all} />
        </section>

        {/* Two-column: Trending + Complaints */}
        <div className="grid sm:grid-cols-2 gap-12">

          <section>
            <div className="flex items-center gap-2 mb-5">
              <span className="font-display text-3xl text-orange leading-none">↑</span>
              <h2 className="font-display text-2xl text-ink tracking-wide">FASTEST RISING</h2>
              <span className="font-mono text-[10px] text-ink/35 self-end mb-0.5">TODAY</span>
            </div>
            <TrendingList items={trending} />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-2xl text-ink tracking-wide">RECENT COMPLAINTS</h2>
            </div>
            <div className="space-y-2">
              {complaints.filter(c => c.reason).slice(0, 6).map(c => (
                <ComplaintCard key={c.id} complaint={c} showSaas />
              ))}
              {complaints.filter(c => c.reason).length === 0 && (
                <p className="font-mono text-sm text-ink/30">Nothing filed yet. Say what everyone&apos;s thinking.</p>
              )}
            </div>
          </section>

        </div>

        {/* Stats bar */}
        <section className="border-2 border-ink/15 bg-cream">
          <div className="grid grid-cols-3 divide-x-2 divide-ink/15">
            {[
              { label: 'Hate Votes Cast', value: totalVotes.toLocaleString() },
              { label: 'SaaS Indicted', value: all.length.toString() },
              { label: 'Complaints on Record', value: complaints.filter(c => c.reason).length.toString() },
            ].map(stat => (
              <div key={stat.label} className="text-center py-8 px-4">
                <div className="font-display text-4xl text-rage mb-1">{stat.value}</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-ink border-t-2 border-ink mt-8 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl tracking-wider">
            <span className="text-paper">SaaS</span>
            <span className="text-rage">Hate</span>
          </div>
          <p className="font-mono text-xs text-paper/30">
            Raw internet sentiment. Not affiliated with any SaaS company.
          </p>
        </div>
      </footer>
    </div>
  )
}
