# Wish Basket BD

Online shop for home essentials, kitchenware, decor, kids' items, gifts and plants, with delivery all over Bangladesh.

Built with **Next.js 16**, **React 19**, **Tailwind CSS 4** and **Supabase** (database, login and photo storage).

## Features

**Store**
- Home page with cover banner, category tiles, Featured and New Arrivals rows, and a row per category
- Shop and category pages with sorting
- Product pages with a photo gallery and related products
- Cart, checkout (Inside / Outside Dhaka delivery, Cash on Delivery or bKash) and order confirmation
- Customer sign-up / sign-in, My Orders, wishlist, About and Contact pages

**Admin panel** (`/admin/login`)
- Manage Store: add / update / remove categories and items, with multiple photos per item
- Dashboard with sales, best sellers and low-stock alerts
- Orders (status updates; cancelling returns stock), products, customers, contact messages
- Settings: announcement text, hotline, delivery charges, admin password

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000.

Without Supabase keys the site still runs, keeping data in the browser (demo mode).

## Supabase setup

See [supabase/SETUP.md](supabase/SETUP.md). In short:

1. Create a Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql) in the SQL Editor.
3. Create the admin user in Authentication → Users and mark it as admin.
4. Put the Project URL and **anon public** key in `.env.local`.

Never commit `.env.local` or the `service_role` key.
