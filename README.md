# SaaS App — Multi-tenant SaaS Management Platform

A production-ready multi-tenant SaaS application built with Next.js 15, featuring authentication, payments, CMS, file storage, email automation, admin dashboard, and user center.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + Radix UI primitives
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (credentials, OAuth, Magic Link, Turnstile)
- **Payments:** Stripe Checkout + Webhooks + Billing Portal
- **Storage:** Cloudflare R2 (S3-compatible)
- **Email:** Resend + React Email templates
- **i18n:** next-intl (English / Chinese)
- **Testing:** Vitest + Testing Library
- **Deployment:** Docker + GitHub Actions CI

## Architecture

```
saas-app/
├── src/
│   ├── app/[locale]/       # App Router pages with i18n
│   │   ├── admin/          # Admin dashboard (users, plans, CMS, files)
│   │   ├── auth/           # Login, register, magic link
│   │   ├── blog/           # Public blog with CMS content
│   │   ├── dashboard/      # User dashboard
│   │   ├── pricing/        # Subscription pricing page
│   │   └── user/           # Profile, subscription, billing, usage
│   ├── app/api/            # API routes (protected)
│   │   ├── admin/          # Admin CRUD endpoints
│   │   ├── auth/           # Better Auth handler
│   │   ├── billing/        # Stripe checkout & portal
│   │   ├── content/        # Public content API
│   │   ├── email/          # Email subscription
│   │   ├── files/          # File listing
│   │   ├── upload/         # File upload to R2
│   │   └── webhooks/       # Stripe webhook handler
│   ├── components/
│   │   ├── admin/          # Admin sidebar
│   │   ├── emails/         # Email templates
│   │   ├── layout/         # Navbar, footer, theme provider
│   │   ├── pricing/        # PlanCard components
│   │   └── ui/             # Button, Input, Card, Toaster
│   ├── lib/
│   │   ├── auth/           # Better Auth config
│   │   ├── db/             # Drizzle schema & connection
│   │   ├── email/          # Resend client
│   │   ├── i18n/           # next-intl config
│   │   ├── permissions/    # RBAC helpers
│   │   ├── r2/             # Cloudflare R2 client
│   │   ├── security/       # Sanitization, pagination
│   │   ├── stripe/         # Stripe client & helpers
│   │   └── ui/             # cn() utility
│   ├── middleware.ts        # i18n middleware
│   ├── styles/             # Global CSS + variables
│   └── types/              # TypeScript types
├── messages/               # i18n messages (en, zh)
├── tests/                  # Unit & integration tests
├── Dockerfile              # Multi-stage build
└── docker-compose.yml      # App + PostgreSQL
```

## Database Schema

- **tenants** — Multi-tenant organizations
- **users** — Users with role-based access (super_admin/admin/member/viewer)
- **sessions** — Better Auth session store
- **plans** — Subscription plans with pricing and features
- **subscriptions** — User subscriptions synced with Stripe
- **orders** — Order history
- **content** — CMS articles with visibility control
- **content_categories** — Content categorization
- **files** — File metadata referencing R2 objects
- **email_subscriptions** — Newsletter subscriptions

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Stripe account
- Cloudflare R2 bucket
- Resend API key

### Setup

```bash
# Install dependencies
npm install

# Copy env vars
cp .env.example .env.local
# Fill in your credentials

# Initialize database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

### Testing

```bash
npm test          # Run tests
npm run test:watch  # Watch mode
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/*` | Better Auth (sign-in, sign-up, OAuth, magic link) |
| `POST /api/webhooks/stripe` | Stripe event webhook |
| `POST /api/billing/checkout` | Create Stripe checkout session |
| `POST /api/billing/portal` | Create Stripe billing portal session |
| `GET/POST /api/content` | List/create published content |
| `GET/POST /api/admin/plans` | Manage pricing plans |
| `GET/PATCH /api/admin/users` | Manage users |
| `GET/POST/PATCH /api/admin/cms` | Manage content |
| `DELETE /api/admin/files` | Delete files |
| `POST /api/upload` | Upload file to R2 |
| `GET /api/files` | List files |
| `POST /api/email/subscribe` | Newsletter subscription |

## Security

- CSP / HSTS / X-Frame-Options security headers
- CSRF protection via Better Auth
- Input validation with Zod
- HTML sanitization
- Role-based access control (RBAC)
- Stripe webhook signature verification
- Cloudflare Turnstile bot protection

## Deployment

```bash
# Docker
docker compose up -d

# Or direct
npm run build
npm start
```