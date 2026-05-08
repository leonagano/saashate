import { SaasWithCount, Complaint, TimeFilter } from '@/types'
import { supabase, isSupabaseConfigured } from './supabase'
import { MOCK_SAAS, MOCK_COMPLAINTS, MOCK_TRENDING } from './mock-data'

function getDateFilter(filter: TimeFilter): string | null {
  const now = new Date()
  if (filter === 'today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return start.toISOString()
  }
  if (filter === 'week') {
    const start = new Date(now)
    start.setDate(start.getDate() - 7)
    return start.toISOString()
  }
  return null
}

export async function getLeaderboard(filter: TimeFilter): Promise<SaasWithCount[]> {
  if (!isSupabaseConfigured || !supabase) {
    if (filter === 'today') return MOCK_SAAS.slice(0, 10).map(s => ({ ...s, hate_count: Math.floor(s.hate_count * 0.002) + 1 }))
    if (filter === 'week') return MOCK_SAAS.slice(0, 10).map(s => ({ ...s, hate_count: Math.floor(s.hate_count * 0.05) + 5 }))
    return MOCK_SAAS.slice(0, 10)
  }

  const since = getDateFilter(filter)
  let query = supabase
    .from('hate_votes')
    .select('saas_id, saas_products(id, name, slug, category, logo_url, website_url, created_at)')

  if (since) query = query.gte('created_at', since)

  const { data, error } = await query
  if (error || !data) return []

  const counts: Record<string, { product: SaasWithCount; count: number }> = {}
  for (const row of data) {
    const p = row.saas_products as unknown as SaasWithCount
    if (!p) continue
    if (!counts[p.id]) counts[p.id] = { product: p, count: 0 }
    counts[p.id].count++
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(({ product, count }) => ({ ...product, hate_count: count }))
}

export async function getTrending(): Promise<SaasWithCount[]> {
  if (!isSupabaseConfigured || !supabase) return MOCK_TRENDING

  const since = new Date()
  since.setDate(since.getDate() - 1)

  const { data } = await supabase
    .from('hate_votes')
    .select('saas_id, saas_products(id, name, slug, category, logo_url, website_url, created_at)')
    .gte('created_at', since.toISOString())

  if (!data) return []

  const counts: Record<string, { product: SaasWithCount; count: number }> = {}
  for (const row of data) {
    const p = row.saas_products as unknown as SaasWithCount
    if (!p) continue
    if (!counts[p.id]) counts[p.id] = { product: p, count: 0 }
    counts[p.id].count++
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ product, count }) => ({ ...product, hate_count: count }))
}

export async function getRecentComplaints(): Promise<Complaint[]> {
  if (!isSupabaseConfigured || !supabase) return MOCK_COMPLAINTS.slice(0, 10)

  const { data } = await supabase
    .from('hate_votes')
    .select('id, saas_id, reason, x_handle, profile_url, created_at, saas_products(name, slug)')
    .not('reason', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!data) return []

  return data.map(row => {
    const product = row.saas_products as unknown as { name: string; slug: string }
    return {
      id: row.id,
      saas_id: row.saas_id,
      saas_name: product?.name ?? '',
      saas_slug: product?.slug ?? '',
      reason: row.reason,
      x_handle: row.x_handle ?? null,
      profile_url: row.profile_url ?? null,
      created_at: row.created_at,
    }
  })
}

export async function getSaasBySlug(slug: string): Promise<SaasWithCount | null> {
  if (!isSupabaseConfigured || !supabase) {
    return MOCK_SAAS.find(s => s.slug === slug) ?? null
  }

  const { data: product } = await supabase
    .from('saas_products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) return null

  const { count } = await supabase
    .from('hate_votes')
    .select('id', { count: 'exact', head: true })
    .eq('saas_id', product.id)

  return { ...product, hate_count: count ?? 0 }
}

export async function getComplaintsForSaas(saasId: string): Promise<Complaint[]> {
  if (!isSupabaseConfigured || !supabase) {
    const mock = MOCK_SAAS.find(s => s.id === saasId)
    return MOCK_COMPLAINTS.filter(c => c.saas_id === saasId).slice(0, 20).map(c => ({
      ...c,
      saas_name: mock?.name ?? '',
      saas_slug: mock?.slug ?? '',
    }))
  }

  const { data } = await supabase
    .from('hate_votes')
    .select('id, saas_id, reason, x_handle, profile_url, created_at, saas_products(name, slug)')
    .eq('saas_id', saasId)
    .not('reason', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!data) return []

  return data.map(row => {
    const product = row.saas_products as unknown as { name: string; slug: string }
    return {
      id: row.id,
      saas_id: row.saas_id,
      saas_name: product?.name ?? '',
      saas_slug: product?.slug ?? '',
      reason: row.reason,
      x_handle: row.x_handle ?? null,
      profile_url: row.profile_url ?? null,
      created_at: row.created_at,
    }
  })
}

export async function searchSaas(query: string): Promise<SaasWithCount[]> {
  if (!query.trim()) return []

  if (!isSupabaseConfigured || !supabase) {
    const q = query.toLowerCase()
    return MOCK_SAAS.filter(s => s.name.toLowerCase().includes(q)).slice(0, 8)
  }

  const { data } = await supabase
    .from('saas_products')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(8)

  if (!data) return []

  const results: SaasWithCount[] = []
  for (const product of data) {
    const { count } = await supabase
      .from('hate_votes')
      .select('id', { count: 'exact', head: true })
      .eq('saas_id', product.id)
    results.push({ ...product, hate_count: count ?? 0 })
  }

  return results
}
