# Halden — E-commerce Store

A quiet-premium homewares storefront: browse a curated catalogue, filter and search, manage a
cart, check out through a realistic (simulated) payment flow, track orders in an
account, and manage products from an admin studio.

> **The frontend is fully standalone** — it runs on a mock data layer (seed JSON
> in `src/lib/mock.ts` + `localStorage` for carts, orders, sessions and product
> edits), and builds as a pure static site (`output: 'export'`). The Django REST
> backend in [`backend/`](backend/) is kept in the repo as a code showcase but
> is **not required** to run or deploy the demo.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router, **static export**) + React 18 + TypeScript |
| Data (demo) | Mock layer + localStorage — search/sort/pagination, cart pricing, orders, auth, product CRUD |
| Styling | Tailwind CSS 3.4 — warm-white palette, single clay accent, Cormorant Garamond + Manrope |
| Icons | Lucide React |
| Backend (showcase only) | Django 5 + DRF, JWT (SimpleJWT), Stripe test-mode, drf-spectacular, SQLite |

## Quick Start — storefront demo (port 3005)

```bash
cd frontend
npm install
npm run dev                       # mock data, no backend needed
```

Open http://localhost:3005. Production artifact:

```bash
npm run build                     # static export → out/ (36 pages incl. product SSG)
npx serve out                     # preview the exact deployable output
```

## Demo Credentials

The login page has one-tap **"use shopper" / "use studio admin"** buttons that
fill the form for you.

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin (studio) | `studio@halden.co` | `HaldenAdmin#1` | Storefront + `/studio` product CRUD |
| Shopper | `shopper@halden.co` | `Shopper#2025` | Storefront + seeded order history at `/account` |

Guest checkout works without an account. You can also register new accounts —
they persist to `localStorage`.

## Features

- **Catalogue** — category pages, keyword search, material filter and sorting (client-side over the mock, debounced)
- **Product detail** — large imagery, spec table, stock-aware add-to-cart, related pieces
- **Cart** — slide-over drawer + full cart page; totals priced by the same rules the Django serializer uses
- **Checkout** — shipping form + realistic card-payment form (formatting + validation), then a **success page with an order number** (`HD-2026-00XX`). No real payment is taken — demo card `4242 4242 4242 4242`, any future expiry, any 3-digit CVC
- **Accounts** — register/login, order history
- **Admin studio** — `/studio`: create, edit, activate/deactivate and delete products (persisted to localStorage)
- **Polish** — skeletons, empty & error states, 404 page, favicon, SEO metadata, responsive at 375/768/1280px

## Deploy as a static site (Netlify / Vercel)

`netlify.toml` (base `frontend/`, publish `out/`) and `frontend/vercel.json`
are included. Three commands:

```bash
# Netlify (from repo root)
npm --prefix frontend install && npm --prefix frontend run build
npx netlify deploy --prod

# Vercel (from frontend/)
cd frontend && npm install && npm run build
npx vercel deploy --prod
```

No environment variables needed — the site is fully static.

## Mock Data Layer

`frontend/src/lib/mock.ts` implements the same routes and payload shapes the
Django backend exposes, so swapping back to the live API is a transport change
only:

| Call | Behaviour |
|------|-----------|
| `listProducts({search, category, material, ordering, page})` | filter + sort + paginate over seed/localStorage |
| `priceCart(items)` | free shipping over **$120**, else flat **$9**; 8% tax; rejects sold-out/inactive lines |
| `createOrder(payload)` | validates, decrements stock, returns order with `reference: HD-YYYY-00NN`, status `paid` |
| `ordersFor(email)` | order history (admins see all) |
| `login / register / currentUser / setSession` | session in localStorage |
| `upsertProduct / deleteProduct / listAllForAdmin` | studio CRUD |

Keys are versioned (`halden.products.v1`, `halden.orders.v1`, `halden.users.v1`,
`halden.session.v1`) — clearing site data resets the whole demo to seed.

## Optional — run the Django showcase backend

Not needed for the demo. To explore the API code:

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate && python seed.py
python manage.py runserver 8002   # Swagger UI at /api/docs/
```

## Design Tokens

- Paper `#FAF8F5` · sand `#EDE4D8 / #E2D6C4 / #F3EDE4` · ink `#1A1714 / #5B534A / #8C8378`
- Hairline `#E1D8CB` · single accent clay `#8A5A44` (`#6E4634` hover) · success `#3E6B4F` · danger `#9B3B32`
- Headings: Cormorant Garamond · Body: Manrope · Radius: 2px cards / pill controls · No gradients, no glassmorphism

## Screenshots

Responsive QA captures (375 / 768 / 1280 px, production build) live in
[`_screenshots/05-storefront/`](../_screenshots/05-storefront).
