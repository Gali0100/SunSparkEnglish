# SunSpark English

MVP for **SunSpark English** (Miss Gali): parent portal (ES), kids games (EN), and admin panel.

- Repo: https://github.com/Gali0100/SunSparkEnglish
- Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Auth.js · Prisma · SQLite (local) / Postgres (Neon)

## Features

- Parent accounts (email/password) with privacy consent checkbox
- Admin role for `fergie0a04@gmail.com`
- Booking Mon–Fri 2–6 PM Guatemala (1h, Q75) with PayPal mock / transfer / cash
- Admin calendar: block days, mark payments, confirm/release holds
- Kids zone: play-as-child, parent PIN exit, avatar builder, age bands, 10 game slots (3 playable), stars, 45 min screen limit
- WhatsApp `+502 4587-3127`

## Quick start (local)

```bash
npm install
cp .env.example .env   # already fine for demo defaults
npm run db:setup       # prisma db push + seed
npm run dev
```

Open http://localhost:3000

### Demo accounts (after seed)

| Role   | Email                 | Password            | PIN  |
|--------|-----------------------|---------------------|------|
| Parent | `padre@demo.com`      | `padre123`          | 1234 |
| Admin  | `fergie0a04@gmail.com`| `MissGaliAdmin2026!`| 2468 |

## Environment variables

See `.env.example`. Important:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | `file:./dev.db` locally; Neon Postgres URL in production |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` / `NEXTAUTH_URL` | App origin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Leave empty → **MOCK** PayPal (instant confirm) |
| `PAYPAL_MODE` | `mock` (default) or `live` (TODO: Orders API) |
| `BANK_*` | Shown on transfer checkout |
| `WHATSAPP_NUMBER` | Digits only, e.g. `50245873127` |

## Payments (pragmatic MVP)

- **PayPal:** mock mode confirms instantly when keys are missing. Live Checkout is stubbed with TODOs in `src/lib/paypal.ts`.
- **Transfer:** booking → `PENDING_TRANSFER`; admin marks paid.
- **Cash:** booking → `HELD_CASH`; admin confirms or releases; tool to auto-release unpaid holds &lt;24h.

## Database upgrade path

1. Local demo uses **SQLite** (`prisma/schema.prisma` provider `sqlite`).
2. For Vercel + Neon: change `provider` to `postgresql`, set `DATABASE_URL` to the Neon string, run `npx prisma db push` (or migrate), then `npm run db:seed`.

## Deploy to Vercel

1. Import the GitHub repo in Vercel.
2. Set env vars (`AUTH_SECRET`, `AUTH_URL`, `DATABASE_URL` Postgres, optional PayPal/bank).
3. Switch Prisma provider to `postgresql` before production deploy (SQLite files do not persist on serverless).
4. Build command: `npm run build` (runs `prisma generate`).
5. After first deploy, run seed once (Vercel CLI / one-off): `npx tsx prisma/seed.ts`.
6. Connect domain `sunsparkenglish.com` when purchased (HTTPS via Vercel). Domain purchase is **not** required to demo this MVP.

## Scripts

- `npm run dev` — local server
- `npm run build` / `npm start` — production
- `npm run db:setup` — push schema + seed
- `npm run lint` — ESLint

## Brand

Pastels `#FFF9C4` `#FFF176` `#FAFAFA` `#E0F7FA` `#B2EBF2`, rounded UI, fonts Nunito / Fredoka / Quicksand. Assets in `/public` (logo, Miss Gali + Sunny).
