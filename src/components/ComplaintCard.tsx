import Link from 'next/link'
import { Complaint } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function safeHostname(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

export function ComplaintCard({ complaint, showSaas = true }: { complaint: Complaint; showSaas?: boolean }) {
  if (!complaint.reason) return null

  const hasIdentity = !!(complaint.x_handle || complaint.profile_url)

  return (
    <div className="border-l-4 border-rage bg-white border border-l-4 border-ink/10 pl-0 overflow-hidden" style={{ borderLeftColor: '#CC0000', borderLeftWidth: '4px' }}>
      <div className="px-5 py-4 space-y-3">
        <p className="font-mono text-sm text-ink/85 leading-relaxed">&ldquo;{complaint.reason}&rdquo;</p>

        <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
          {/* Author — identity or anonymous */}
          {complaint.x_handle ? (
            <a
              href={`https://x.com/${complaint.x_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rage font-bold hover:underline"
            >
              @{complaint.x_handle}
            </a>
          ) : complaint.profile_url ? (
            <a
              href={complaint.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rage font-bold hover:underline"
            >
              {safeHostname(complaint.profile_url)} ↗
            </a>
          ) : (
            <span className="text-ink/25 tracking-wider">ANONYMOUS</span>
          )}

          {/* Extra identity link if both are present */}
          {complaint.x_handle && complaint.profile_url && (
            <>
              <span className="text-ink/20">·</span>
              <a
                href={complaint.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/40 hover:text-rage hover:underline transition-colors"
              >
                {safeHostname(complaint.profile_url)} ↗
              </a>
            </>
          )}

          <span className="text-ink/20">·</span>
          <span className="text-ink/35">{timeAgo(complaint.created_at)}</span>

          {showSaas && complaint.saas_name && (
            <>
              <span className="text-ink/20">·</span>
              <Link href={`/${complaint.saas_slug}`} className="text-ink/40 hover:text-rage transition-colors font-semibold">
                {complaint.saas_name}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
