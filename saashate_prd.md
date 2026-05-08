# SaaSHate — MVP PRD

## One-Liner

A public leaderboard where people vote for the SaaS products they hate the most.

Simple.
Fast.
Emotionally addictive.

---

# Product Thesis

People love complaining about software.

Especially software they:
- pay for monthly
- are forced to use at work
- cannot easily leave
- feel trapped by

Existing SaaS review platforms are:
- overly polished
- fake
- incentive-driven
- SEO spam

SaaSHate is the opposite.

Not balanced reviews.

Raw internet sentiment.

---

# Core Idea

Users:
- search a SaaS product
- click “I hate this SaaS”
- optionally leave a short reason

That action updates:
- rankings
- trend charts
- category hate scores

The product is essentially:
“Rotten Tomatoes for SaaS frustration.”

---

# MVP Goal

Validate:
1. People will publicly vote against SaaS tools
2. Rankings become shareable
3. SaaS alternative monetization works

---

# MVP Scope

## Core Features

### 1. SaaS Search

Search bar with autocomplete.

Examples:
- Salesforce
- HubSpot
- Zoom
- Dropbox
- Jira
- Slack
- Notion

Data source:
manually seeded initially.

---

### 2. Hate Vote

Primary CTA:

“I hate this SaaS”

One click.

Optional follow-up:
“What made you hate it?”

Character limit:
140 chars.

Examples:
- “Pricing doubled.”
- “Impossible to cancel.”
- “Slow and bloated.”
- “Customer support vanished.”

No long reviews.

---

### 3. Public Leaderboard

Homepage displays:

## Most Hated SaaS
- Today
- This week
- All time

Example:

| Rank | SaaS | Hate Votes |
|---|---|---|
| 1 | Salesforce | 18,441 |
| 2 | NetSuite | 15,220 |
| 3 | Jira | 12,003 |

---

### 4. SaaS Pages

Example:
`/salesforce`

Contains:
- total hate votes
- trending complaints
- common complaint tags
- alternatives users switched to

Simple page structure.

---

### 5. Missing SaaS Flow

If a user searches for a SaaS that does not exist:

DO NOT show:
“No results found.”

Instead show:

## “This SaaS hasn’t been hated yet.”

CTA:
“Add it to SaaSHate”

User can submit:
- SaaS name
- website URL (optional)
- category
- first complaint

Submitting:
- automatically creates SaaS page
- adds first hate vote
- creates first complaint entry

This turns:
search intent → content generation.

---

# What NOT To Build

Do NOT build:
- detailed reviews
- star ratings
- user profiles
- social feeds
- messaging
- communities
- AI summaries
- discussion forums
- enterprise dashboards
- notifications

MVP should feel:
- brutally simple
- immediate
- emotionally reactive

---

# UX Principles

## 1. Frictionless

No signup required initially.

Anonymous by default.

Voting should take:
<5 seconds.

---

## 2. Emotion First

This is not:
“software procurement.”

This is:
“software rage.”

That emotional energy is the growth engine.

---

## 3. Entertainment Matters

The leaderboard itself is content.

People should browse it for fun.

---

## 4. Never Dead-End The User

Never show:
“No results.”

Always convert:
searches into participation.

Every failed search becomes:
- a new SaaS page
- a new indexed SEO page
- a new voting opportunity

---

# Homepage Structure

## Hero

“SaaSHate”

Subheadline:

“The internet’s most hated SaaS ranking.”

---

## Sections

### Most Hated Today

### Fastest Rising Hate

### Most Hated by Engineers

### Most Hated by Startups

### Recent Complaints

Examples:
- “Support disappeared after onboarding.”
- “Pricing became insane.”
- “Feels like enterprise punishment.”
- “Every update made it worse.”

---

# Viral Mechanics

## Shareable Rankings

Examples:
- “Jira just overtook Salesforce.”
- “Most hated SaaS of 2026.”
- “Founders hate this CRM.”

---

## Screenshotable Content

Small complaint cards optimized for:
- X
- LinkedIn
- Reddit

---

## Identity-Based Hate

People love:
- shared suffering
- validating frustration
- workplace complaints

This creates organic discussion.

---

# Moderation

Critical.

Without moderation:
site becomes spam immediately.

---

## MVP Moderation Rules

Remove:
- threats
- personal attacks
- doxxing
- racism
- fake accusations
- irrelevant spam

Allow:
- frustration
- sarcasm
- blunt criticism
- pricing complaints
- UX complaints

---

## Anti-Spam Protection

Needed from day one.

Rules:
- minimum SaaS name length
- duplicate detection
- profanity filtering
- rate limiting
- optional moderation queue

Otherwise:
people will create garbage entries.

---

# Data Model

## SaaS Products
- id
- name
- slug
- category
- logo_url
- website_url
- created_at

---

## Hate Votes
- id
- saas_id
- reason
- role
- anonymous
- created_at

---

## Categories
- CRM
- Project Management
- HR
- Accounting
- Communication
- Marketing
- Analytics
- DevTools

---

# Tech Stack

## Frontend
- Next.js
- Tailwind

---

## Backend
- Supabase

---

## Hosting
- Vercel

---

# MVP Build Plan

## Day 1
- homepage
- leaderboard
- SaaS pages

---

## Day 2
- vote system
- anonymous posting
- short complaints

---

## Day 3
- search/autocomplete
- rankings
- moderation queue

---

## Day 4
- add-missing-SaaS flow
- social sharing cards
- deploy
- seed data

---

# Seeding Strategy

Critical for launch.

You need initial hate density.

---

## Source Initial Complaints From

- Reddit
- X
- Hacker News
- SaaS Twitter
- YouTube comments

Reformat into:
short complaint snippets.

---

# Distribution Strategy

## X / LinkedIn Content

Examples:
- “Top 10 most hated SaaS by startups”
- “Why everyone suddenly hates Notion”
- “The SaaS hate index”

---

## SEO

Extremely strong SEO opportunities:
- “Why people hate Salesforce”
- “HubSpot complaints”
- “Worst CRM software”
- “Alternatives to NetSuite”

Long-tail SEO expands automatically through:
user-created SaaS pages.

---

# Monetization

## Phase 1 — Affiliate Links

Strongest immediate monetization.

Example:
“Hate HubSpot?
Try Attio.”

Affiliate link.

This is high-intent traffic.

---

## Phase 2 — Sponsored Alternatives

Example:
On Salesforce page:

“Thinking about leaving Salesforce?
Try Close.”

Paid placement.

---

## Phase 3 — Featured Alternatives

“Least hated CRM”

Sponsored ranking slots.

---

## Phase 4 — SaaS Sentiment Data

Sell:
- trend reports
- reputation analytics
- churn sentiment
- pricing backlash analysis

Potential buyers:
- SaaS companies
- VCs
- consultants
- analysts

---

# Success Metrics

## Engagement
- votes/day
- complaints/day
- shares/day
- repeat visitors

---

## Growth
- SEO impressions
- backlinks
- social mentions

---

## Revenue
- affiliate CTR
- sponsored clicks
- partner conversions

---

# Biggest Risk

If it feels:
- fake
- manipulated
- corporate

the product dies.

Authenticity is everything.

Rawness is the moat.

---

# Core Positioning

Not:
“SaaS review platform.”

Not:
“Software comparison site.”

Instead:

“The internet’s public SaaS hate index.”

That framing is the product.