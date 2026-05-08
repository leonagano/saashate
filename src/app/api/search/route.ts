import { NextRequest, NextResponse } from 'next/server'
import { searchSaas } from '@/lib/data'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json([])

  const results = await searchSaas(q)
  return NextResponse.json(results)
}
