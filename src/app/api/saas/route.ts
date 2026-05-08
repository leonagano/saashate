import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { CATEGORIES } from '@/types'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, website_url, category, first_complaint } = body

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
  }

  if (category && !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
  }

  const cleanName = name.trim()
  const slug = toSlug(cleanName)

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ slug, demo: true })
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('saas_products')
    .select('slug')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json({ slug: existing.slug })
  }

  const { data: product, error } = await supabase
    .from('saas_products')
    .insert({
      name: cleanName,
      slug,
      category: category || 'CRM',
      website_url: website_url || null,
    })
    .select()
    .single()

  if (error || !product) {
    return NextResponse.json({ error: 'Failed to create SaaS.' }, { status: 500 })
  }

  // Add first hate vote + complaint
  const cleanComplaint = first_complaint ? String(first_complaint).slice(0, 140).trim() || null : null
  await supabase.from('hate_votes').insert({
    saas_id: product.id,
    reason: cleanComplaint,
    anonymous: true,
  })

  return NextResponse.json({ slug: product.slug })
}
