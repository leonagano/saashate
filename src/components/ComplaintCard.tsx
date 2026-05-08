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

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs font-mono text-ink/35 flex-wrap">
            {showSaas && complaint.saas_name && (
              <>
                <Link href={`/${complaint.saas_slug}`} className="hover:text-rage transition-colors font-semibold text-ink/50">
                  {complaint.saas_name}
                </Link>
                <span>·</span>
              </>
            )}
            <span>{timeAgo(complaint.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {complaint.x_handle && (
              <a
                href={`https://x.com/${complaint.x_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-rage hover:underline"
              >
                @{complaint.x_handle}
              </a>
            )}
            {complaint.profile_url && (
              <a
                href={complaint.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-rage hover:underline"
              >
                {safeHostname(complaint.profile_url)} ↗
              </a>
            )}
            {!hasIdentity && (
              <span className="font-mono text-[10px] text-ink/25 tracking-wider">ANONYMOUS</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
