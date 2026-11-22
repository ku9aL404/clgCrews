# CampusCrew

**Your Campus. Your Tasks. Your People.**

CampusCrew is a premium student service marketplace for academic and campus-related work.

## Features

- Public marketplace homepage and service discovery
- Customer, worker, and admin dashboards
- Demo order, earnings, and platform analytics flows
- 80% worker / 20% platform commission defaults
- Supabase authentication and browser/server clients
- Initial PostgreSQL schema and row-level security foundation
- Responsive Tailwind CSS interface

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
5. Create an `order-files` private Storage bucket.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never add it to a client component or `NEXT_PUBLIC_*` variable.

## Routes

- `/` — Marketplace homepage
- `/auth/login` — Sign in
- `/auth/signup` — Account creation
- `/dashboard/customer` — Customer workspace
- `/dashboard/worker` — Worker workspace
- `/dashboard/admin` — Platform administration

## Commission model

The default split is 80% for the worker and 20% for the platform. Admin commission controls are designed around an editable platform percentage, with worker earnings calculated as the remainder.
