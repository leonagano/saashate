export type Category =
  | 'CRM'
  | 'Project Management'
  | 'HR'
  | 'Accounting'
  | 'Communication'
  | 'Marketing'
  | 'Analytics'
  | 'DevTools'

export const CATEGORIES: Category[] = [
  'CRM',
  'Project Management',
  'HR',
  'Accounting',
  'Communication',
  'Marketing',
  'Analytics',
  'DevTools',
]

export interface SaasProduct {
  id: string
  name: string
  slug: string
  category: Category
  logo_url: string | null
  website_url: string | null
  created_at: string
}

export interface SaasWithCount extends SaasProduct {
  hate_count: number
}

export interface Complaint {
  id: string
  saas_id: string
  saas_name: string
  saas_slug: string
  reason: string | null
  x_handle?: string | null
  profile_url?: string | null
  created_at: string
}

export type TimeFilter = 'today' | 'week' | 'all'
