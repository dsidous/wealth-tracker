# Wealth Tracker

Personal wealth dashboard: aggregate assets, choose a base currency, and see net worth in one place. Sign-in users get a private dashboard; the marketing home page introduces the product and routes authenticated users straight to `/dashboard`.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-client-3FCF8E?style=flat-square&logo=supabase&logoColor=black)](https://supabase.com/)
[![TanStack Table](https://img.shields.io/badge/TanStack-Table-FF4154?style=flat-square&logo=tanstack&logoColor=white)](https://tanstack.com/table)
[![Zod](https://img.shields.io/badge/Zod-3B82F6?style=flat-square&logo=zod&logoColor=white)](https://zod.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org/)

## Tech stack

| Area | Technology |
|------|------------|
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router, React Server Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI** | [React](https://react.dev/) 19 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4, [PostCSS](https://postcss.org/) |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) (via `shadcn` package), [Radix UI](https://www.radix-ui.com/) primitives |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animation** | [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css), custom CSS keyframes (no Framer Motion) |
| **Auth** | [Clerk](https://clerk.com/) (`@clerk/nextjs`) — sign-in/sign-up, sessions, optional webhooks |
| **Route protection** | Clerk `clerkMiddleware` in `src/proxy.ts` (Next.js 16 proxy convention) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM & migrations** | [Drizzle ORM](https://orm.drizzle.team/) + [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| **Forms & validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [@hookform/resolvers](https://github.com/react-hook-form/resolvers) |
| **Tables** | [TanStack Table](https://tanstack.com/table) (`@tanstack/react-table`) |
| **Utilities** | [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [class-variance-authority](https://cva.style/) |
| **Numbers** | [big.js](https://mikemcl.github.io/big.js/) (dev dependency for precision where used) |
| **Supabase** | [@supabase/supabase-js](https://supabase.com/docs/reference/javascript), [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) (client/server helpers; configure via env) |
| **Webhooks** | [Svix](https://www.svix.com/) — verifies Clerk webhook signatures (`src/app/api/webhooks/clerks/`) |
| **Linting** | [ESLint](https://eslint.org/) 9 + `eslint-config-next` |

## Features

- Landing page with animated hero, feature sections, and illustrative portfolio preview
- Clerk-authenticated dashboard (`/dashboard`) for asset summary and net worth
- PostgreSQL persistence via Drizzle (schema and migrations under `src/lib/db/`)

## Prerequisites

- **Node.js** (LTS recommended) or **Bun** (this repo includes a `bun.lock` file)
- **PostgreSQL** database and connection string

## Getting started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd wealth-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or: bun install
   ```

3. **Environment variables**

   Copy `.env.example` to `.env` and fill in values:

   | Variable | Purpose |
   |----------|---------|
   | `DATABASE_URL` | PostgreSQL connection string for Drizzle |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
   | `CLERK_SECRET_KEY` | Clerk secret key |
   | `CLERK_WEBHOOK_SECRET` | Verifying Clerk webhooks (e.g. user sync) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (if using Supabase client) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

   Follow the [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs) for redirect URLs and hosted sign-in/sign-up if needed.

4. **Database**

   ```bash
   npm run db:push
   # or generate + migrate: npm run db:generate && npm run db:migrate
   ```

   Optional seed:

   ```bash
   npm run db:seed
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema to the database (dev-friendly) |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Run database seed script |

## Project layout (high level)

- `src/app/` — App Router pages, layouts, API routes, webhooks
- `src/app/_components/` — Shared app-level components (e.g. home marketing)
- `src/lib/db/` — Drizzle schema, migrations, seed
- `src/lib/components/` — UI primitives (shadcn-style)
- `src/lib/services/` — Server-side domain logic
- `src/proxy.ts` — Next.js 16 proxy (Clerk middleware, protected routes)

## License

Private project (`"private": true` in `package.json`). Adjust this section if you open-source the repo.
