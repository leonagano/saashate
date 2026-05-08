import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { saas_id, reason, x_handle, profile_url } = body

  if (!saas_id) {
    return NextResponse.json({ error: 'Missing saas_id' }, { status: 400 })
  }

  const cleanReason = reason ? String(reason).slice(0, 140).trim() || null : null
  const cleanXHandle = x_handle ? String(x_handle).replace(/^@+/, '').slice(0, 50).trim() || null : null
  const cleanProfileUrl = profile_url ? String(profile_url).slice(0, 200).trim() || null : null

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: true, demo: true })
  }

  const { error } = await supabase.from('hate_votes').insert({
    saas_id,
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
