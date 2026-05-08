import Link from 'next/link'
import { getSaasBySlug, getComplaintsForSaas } from '@/lib/data'
import { ALTERNATIVES } from '@/lib/mock-data'
import Navbar from '@/components/Navbar'
import HateButton from '@/components/HateButton'
import { ComplaintCard } from '@/components/ComplaintCard'
import SearchBar from '@/components/SearchBar'
import type { Metadata } from 'next'

export const revalidate = 30

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const saas = await getSaasBySlug(slug)
  if (!saas) return { title: 'SaaSHate' }
  return {
    title: `${saas.name} — ${saas.hate_count.toLocaleString()} Hate Votes | SaaSHate`,
    description: `${saas.hate_count.toLocaleString()} people publicly hate ${saas.name}. See why and vote if you do too.`,
  }
}

export default async function SaasPage({ params }: Props) {
  const { slug } = await params
  const saas = await getSaasBySlug(slug)

  if (!saas) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-28 text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border-4 border-ink/20 text-4xl">
            🤔
          </div>
          <div>
            <h1 className="font-display text-5xl text-ink mb-3">NOT ON THE LIST YET.</h1>
            <p className="font-mono text-sm text-ink/50">Be the first to make it official.</p>
          </div>
          <div className="max-w-lg mx-auto">
            <SearchBar />
          </div>
          <p className="font-mono text-xs text-ink/30">
            Search above to add &ldquo;{slug}&rdquo; — first hate vote is free.
          </p>
          <Link href="/" className="inline-block font-mono text-xs text-ink/40 hover:text-rage transition-colors">
            ← Back to leaderboard
          </Link>
        </div>
      </div>
    )
  }

  const complaints = await getComplaintsForSaas(saas.id)
  const alternatives = ALTERNATIVES[slug] ?? []

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        {/* Header */}
        <div className="border-b-2 border-ink/10 pb-10">
          <Link href="/" className="font-mono text-[10px] tracking-[0.2em] text-ink/35 hover:text-rage transition-colors uppercase mb-6 inline-block">
            ← Leaderboard
          </Link>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 border-2 border-ink flex items-center justify-center shrink-0 bg-cream">
              <span className="font-display text-4xl text-ink">{saas.name[0]}</span>
            </div>
            <div>
              <h1 className="font-display leading-none text-ink" style={{ fontSize: 'clamp(44px, 9vw, 72px)' }}>
                {saas.name}
              </h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="font-mono text-xs border border-ink/25 px-2 py-1 text-ink/50 bg-cream">
                  {saas.category}
                </span>
                {saas.website_url && (
                  <a
                    href={saas.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-rage hover:underline"
                  >
                    {new URL(saas.website_url).hostname} ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hate Button area */}
        <div className="border-2 border-ink/15 bg-white px-8 py-12 text-center">
          <HateButton saasId={saas.id} saasSlug={saas.slug} initialCount={saas.hate_count} />
        </div>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div className="border-2 border-ink/10 bg-cream px-6 py-5">
            <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase mb-4">
              Done with {saas.name}? People are switching to:
            </div>
            <div className="flex flex-wrap gap-2">
              {alternatives.map(alt => (
                <a
                  key={alt.name}
                  href={alt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-ink border-2 border-ink/20 hover:border-rage hover:text-rage px-4 py-2 transition-colors bg-paper"
                >
                  {alt.name} →
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Complaints */}
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-display text-3xl text-ink tracking-wide">COMPLAINTS</h2>
            {complaints.length > 0 && (
              <span className="font-mono text-xs text-ink/35">({complaints.length} filed)</span>
            )}
          </div>

          {complaints.length === 0 ? (
            <div className="border-2 border-ink/10 text-center py-14 bg-cream">
              <p className="font-display text-2xl text-ink/25 mb-2">NO COMPLAINTS YET</p>
              <p className="font-mono text-xs text-ink/30">Say what everyone&apos;s thinking. Be the first.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {complaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} showSaas={false} />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-ink border-t-2 border-ink mt-12 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl tracking-wider">
            <span className="text-paper">SaaS</span>
            <span className="text-rage">Hate</span>
          </Link>
          <p className="font-mono text-xs text-paper/30">
            Raw internet sentiment. Not affiliated with {saas.name}.
          </p>
        </div>
      </footer>
    </div>
  )
}
