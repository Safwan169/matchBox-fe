# MatchBox — Storefront & Admin

The web store for MatchBox (cigarettes, lighters and accessories). It's built with
Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4.

Backend repo: [matchBox-be](https://github.com/Safwan169/matchBox-be)

## Setup

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                  # http://localhost:3000  (the API must be running)
```

`npm run build` and `npm start` build and run the production version. `npm run lint` runs ESLint.

## Features

- **Storefront:** 18+ age gate, home page (hero, categories, featured products), product
  search, sorting and pagination, category pages, product pages with an image gallery
- **Customer:** register (date of birth, 18+ check), log in, account settings, cart (saved in
  the browser and re-checked against the server), checkout with cash on delivery, order
  history, cancelling an order
- **Contact:** a strip with the phone and WhatsApp numbers, contact details in the footer, a
  floating WhatsApp button, and "Ask on WhatsApp" on product pages (all set from admin
  Settings)
- **Admin (`/admin`):** dashboard, orders (status changes), products (create and edit, image
  upload), categories, customers, promotions (hero banners on the home page) and store
  settings

## Structure

```
src/
├── app/            routes (storefront, account, cart/checkout, orders, admin/)
├── components/     ui.tsx (form primitives), layout/, product/, order/, admin/
├── context/        AuthContext (session), CartContext (cart in localStorage)
└── lib/            api client, types, formatting (৳), asset URLs, use-api hook
```

## Theme

The colours and fonts come from the MatchBox Facebook artwork and are defined in
`src/app/globals.css`. Use them as Tailwind classes, e.g. `bg-brand-red`, `text-brand-cream`,
`text-brand-flame` and `font-display` (Ultra).

## Notes for this Next.js version

`cacheComponents` is enabled. Any server-side data loading, and any read of `params` or
`searchParams`, must be inside `<Suspense>`. The same applies to `usePathname`, `useParams`
and `useSearchParams` in client components on dynamic routes. See the docs bundled in
`node_modules/next/dist/docs/`.
