import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// In-memory dedup for demo mode (resets on server restart)
const demoVotes = new Set<string>()

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? '127.0.0.1'
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { saas_id, reason, x_handle, profile_url } = body

  if (!saas_id) {
    return NextResponse.json({ error: 'Missing saas_id' }, { status: 400 })
  }

  const cleanReason = reason ? String(reason).slice(0, 140).trim() || null : null
  const cleanXHandle = x_handle ? String(x_handle).replace(/^@+/, '').slice(0, 50).trim() || null : null
  const cleanProfileUrl = profile_url ? String(profile_url).slice(0, 200).trim() || null : null

  const isInitialVote = !cleanReason && !cleanXHandle && !cleanProfileUrl
  const ipHash = hashIp(getClientIp(req))
  const voteKey = `${ipHash}:${saas_id}`

  // Demo mode — in-memory rate limit for initial votes only
  if (!isSupabaseConfigured || !supabase) {
    if (isInitialVote) {
      if (demoVotes.has(voteKey)) {
        return NextResponse.json({ error: 'Already voted' }, { status: 409 })
      }
      demoVotes.add(voteKey)
    }
    return NextResponse.json({ success: true, demo: true })
  }

  // Production — check for duplicate initial vote by IP + saas_id
  if (isInitialVote) {
    const { data: existing } = await supabase
      .from('hate_votes')
      .select('id')
      .eq('saas_id', saas_id)
      .eq('ip_hash', ipHash)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 })
    }
  }

  // For complaint submissions, update the existing vote record if one exists
  if (!isInitialVote) {
    const { data: existing } = await supabase
      .from('hate_votes')
      .select('id')
      .eq('saas_id', saas_id)
      .eq('ip_hash', ipHash)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('hate_votes')
        .update({
          reason: cleanReason,
          x_handle: cleanXHandle,
          profile_url: cleanProfileUrl,
          anonymous: !cleanXHandle && !cleanProfileUrl,
        })
        .eq('id', existing.id)
      return NextResponse.json({ success: true })
    }
    // No existing vote found — fall through to insert (edge case)
  }

  const { error } = await supabase.from('hate_votes').insert({
    saas_id,
    ip_hash: ipHash,
    reason: cleanReason,
    x_handle: cleanXHandle,
    profile_url: cleanProfileUrl,
    anonymous: !cleanXHandle && !cleanProfileUrl,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
