import { SaasWithCount, Complaint } from '@/types'

export const MOCK_SAAS: SaasWithCount[] = [
  { id: '1', name: 'Salesforce', slug: 'salesforce', category: 'CRM', logo_url: null, website_url: 'https://salesforce.com', created_at: '2024-01-01T00:00:00Z', hate_count: 18441 },
  { id: '2', name: 'NetSuite', slug: 'netsuite', category: 'Accounting', logo_url: null, website_url: 'https://netsuite.com', created_at: '2024-01-01T00:00:00Z', hate_count: 15220 },
  { id: '3', name: 'Jira', slug: 'jira', category: 'Project Management', logo_url: null, website_url: 'https://atlassian.com/jira', created_at: '2024-01-01T00:00:00Z', hate_count: 12003 },
  { id: '4', name: 'SAP', slug: 'sap', category: 'Accounting', logo_url: null, website_url: 'https://sap.com', created_at: '2024-01-01T00:00:00Z', hate_count: 10891 },
  { id: '5', name: 'HubSpot', slug: 'hubspot', category: 'CRM', logo_url: null, website_url: 'https://hubspot.com', created_at: '2024-01-01T00:00:00Z', hate_count: 9432 },
  { id: '6', name: 'Zoom', slug: 'zoom', category: 'Communication', logo_url: null, website_url: 'https://zoom.us', created_at: '2024-01-01T00:00:00Z', hate_count: 7821 },
  { id: '7', name: 'Workday', slug: 'workday', category: 'HR', logo_url: null, website_url: 'https://workday.com', created_at: '2024-01-01T00:00:00Z', hate_count: 6543 },
  { id: '8', name: 'ServiceNow', slug: 'servicenow', category: 'Project Management', logo_url: null, website_url: 'https://servicenow.com', created_at: '2024-01-01T00:00:00Z', hate_count: 5982 },
  { id: '9', name: 'Slack', slug: 'slack', category: 'Communication', logo_url: null, website_url: 'https://slack.com', created_at: '2024-01-01T00:00:00Z', hate_count: 4872 },
  { id: '10', name: 'Notion', slug: 'notion', category: 'Project Management', logo_url: null, website_url: 'https://notion.so', created_at: '2024-01-01T00:00:00Z', hate_count: 4102 },
  { id: '11', name: 'Dropbox', slug: 'dropbox', category: 'DevTools', logo_url: null, website_url: 'https://dropbox.com', created_at: '2024-01-01T00:00:00Z', hate_count: 3654 },
  { id: '12', name: 'Marketo', slug: 'marketo', category: 'Marketing', logo_url: null, website_url: 'https://marketo.com', created_at: '2024-01-01T00:00:00Z', hate_count: 3441 },
  { id: '13', name: 'Asana', slug: 'asana', category: 'Project Management', logo_url: null, website_url: 'https://asana.com', created_at: '2024-01-01T00:00:00Z', hate_count: 2987 },
  { id: '14', name: 'BambooHR', slug: 'bamboohr', category: 'HR', logo_url: null, website_url: 'https://bamboohr.com', created_at: '2024-01-01T00:00:00Z', hate_count: 2541 },
  { id: '15', name: 'Monday.com', slug: 'monday-com', category: 'Project Management', logo_url: null, website_url: 'https://monday.com', created_at: '2024-01-01T00:00:00Z', hate_count: 2103 },
  { id: '16', name: 'Zendesk', slug: 'zendesk', category: 'CRM', logo_url: null, website_url: 'https://zendesk.com', created_at: '2024-01-01T00:00:00Z', hate_count: 1876 },
  { id: '17', name: 'Intercom', slug: 'intercom', category: 'Marketing', logo_url: null, website_url: 'https://intercom.com', created_at: '2024-01-01T00:00:00Z', hate_count: 1543 },
  { id: '18', name: 'QuickBooks', slug: 'quickbooks', category: 'Accounting', logo_url: null, website_url: 'https://quickbooks.com', created_at: '2024-01-01T00:00:00Z', hate_count: 1231 },
  { id: '19', name: 'Mixpanel', slug: 'mixpanel', category: 'Analytics', logo_url: null, website_url: 'https://mixpanel.com', created_at: '2024-01-01T00:00:00Z', hate_count: 987 },
  { id: '20', name: 'Datadog', slug: 'datadog', category: 'DevTools', logo_url: null, website_url: 'https://datadog.com', created_at: '2024-01-01T00:00:00Z', hate_count: 876 },
]

export const MOCK_COMPLAINTS: Complaint[] = [
  { id: 'c1', saas_id: '1', saas_name: 'Salesforce', saas_slug: 'salesforce', reason: 'Pricing doubled overnight with zero notice.', x_handle: 'pissed_at_crm', profile_url: null, created_at: '2026-05-07T10:00:00Z' },
  { id: 'c2', saas_id: '3', saas_name: 'Jira', saas_slug: 'jira', reason: 'Every sprint I lose 2 hours to bugs in Jira itself.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:55:00Z' },
  { id: 'c3', saas_id: '2', saas_name: 'NetSuite', saas_slug: 'netsuite', reason: 'Support disappeared after onboarding. Ghost town.', x_handle: 'cfoto', profile_url: 'https://carlafoto.com', created_at: '2026-05-07T09:50:00Z' },
  { id: 'c4', saas_id: '5', saas_name: 'HubSpot', saas_slug: 'hubspot', reason: 'Impossible to cancel without calling sales three times.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:48:00Z' },
  { id: 'c5', saas_id: '7', saas_name: 'Workday', saas_slug: 'workday', reason: 'Feels like enterprise punishment designed in 2009.', x_handle: 'marktweet', profile_url: null, created_at: '2026-05-07T09:45:00Z' },
  { id: 'c6', saas_id: '4', saas_name: 'SAP', saas_slug: 'sap', reason: 'Every update makes it slower and breaks something.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:40:00Z' },
  { id: 'c7', saas_id: '1', saas_name: 'Salesforce', saas_slug: 'salesforce', reason: 'Slow and bloated. Takes 10 clicks to log a call.', x_handle: null, profile_url: 'https://devrant.io', created_at: '2026-05-07T09:35:00Z' },
  { id: 'c8', saas_id: '9', saas_name: 'Slack', saas_slug: 'slack', reason: 'Pricing became insane for what is essentially a chat app.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:30:00Z' },
  { id: 'c9', saas_id: '10', saas_name: 'Notion', saas_slug: 'notion', reason: 'Performance is tragic. My brain works faster than their editor.', x_handle: 'notionhater', profile_url: null, created_at: '2026-05-07T09:25:00Z' },
  { id: 'c10', saas_id: '3', saas_name: 'Jira', saas_slug: 'jira', reason: 'Designed for project managers who hate developers.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:20:00Z' },
  { id: 'c11', saas_id: '8', saas_name: 'ServiceNow', saas_slug: 'servicenow', reason: 'UI from 2011. Nothing works intuitively.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:15:00Z' },
  { id: 'c12', saas_id: '6', saas_name: 'Zoom', saas_slug: 'zoom', reason: 'Audio randomly cuts out in every third meeting.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:10:00Z' },
  { id: 'c13', saas_id: '12', saas_name: 'Marketo', saas_slug: 'marketo', reason: 'Takes 45 minutes to send a single email campaign.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:05:00Z' },
  { id: 'c14', saas_id: '5', saas_name: 'HubSpot', saas_slug: 'hubspot', reason: 'Everything is a paid add-on. The free tier is bait.', x_handle: null, profile_url: null, created_at: '2026-05-07T09:00:00Z' },
  { id: 'c15', saas_id: '2', saas_name: 'NetSuite', saas_slug: 'netsuite', reason: 'Customization costs more than the license.', x_handle: null, profile_url: null, created_at: '2026-05-07T08:55:00Z' },
]

export const MOCK_TRENDING: SaasWithCount[] = [
  { ...MOCK_SAAS[2], hate_count: 892 },
  { ...MOCK_SAAS[4], hate_count: 743 },
  { ...MOCK_SAAS[8], hate_count: 521 },
  { ...MOCK_SAAS[9], hate_count: 445 },
  { ...MOCK_SAAS[0], hate_count: 388 },
]

export const ALTERNATIVES: Record<string, { name: string; url: string }[]> = {
  salesforce: [{ name: 'Attio', url: 'https://attio.com' }, { name: 'Close', url: 'https://close.com' }, { name: 'Pipedrive', url: 'https://pipedrive.com' }],
  hubspot: [{ name: 'Attio', url: 'https://attio.com' }, { name: 'Brevo', url: 'https://brevo.com' }],
  jira: [{ name: 'Linear', url: 'https://linear.app' }, { name: 'Height', url: 'https://height.app' }, { name: 'Shortcut', url: 'https://shortcut.com' }],
  netsuite: [{ name: 'Ramp', url: 'https://ramp.com' }, { name: 'Pilot', url: 'https://pilot.com' }],
  slack: [{ name: 'Discord', url: 'https://discord.com' }, { name: 'Zulip', url: 'https://zulip.com' }],
  notion: [{ name: 'Obsidian', url: 'https://obsidian.md' }, { name: 'Coda', url: 'https://coda.io' }],
  workday: [{ name: 'Rippling', url: 'https://rippling.com' }, { name: 'Gusto', url: 'https://gusto.com' }],
  zoom: [{ name: 'Around', url: 'https://www.around.co' }, { name: 'Whereby', url: 'https://whereby.com' }],
  asana: [{ name: 'Linear', url: 'https://linear.app' }, { name: 'Todoist', url: 'https://todoist.com' }],
}
