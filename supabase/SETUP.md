# Connect Wish Basket BD to Supabase

Until these steps are done the site keeps working on browser storage (each browser has its own data).
After them, every visitor and device shares one database: products, photos, categories, orders,
customer accounts, contact messages, store settings and the admin login.

## 1. Create the project
1. Go to https://supabase.com and sign in.
2. Select the organization **sultanaraziarinti-source's Org** → **New project**.
3. Name: `wish-basket-bd` · Region: **Singapore** (closest to Bangladesh) · set a database password and save it somewhere safe.
4. Wait about 2 minutes for it to finish setting up.

## 2. Create the tables
1. Left menu → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy **all** of it, paste, and click **Run**.
   It should end with "Success. No rows returned". It's safe to run again later.

## 3. Create the admin account
1. Left menu → **Authentication** → **Users** → **Add user** → **Create new user**.
   - Email: `bdwishbasket@gmail.com`
   - Password: the admin password you want (at least 8 characters)
   - Tick **Auto Confirm User** → **Create user**
2. Back in **SQL Editor**, run:
   ```sql
   update profiles set is_admin = true where email = 'bdwishbasket@gmail.com';
   ```

## 4. Connect the website
1. Left menu → **Project Settings** → **API** (or **Data API**). Copy:
   - **Project URL**
   - **anon public** key (NOT the `service_role` key — never put that in the website)
2. In the `wish-basket-bd` folder, copy `.env.example` to a new file named `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Stop and restart the website: `npm run dev -- -H 0.0.0.0`

## 5. Optional
- **Customer email confirmation**: Authentication → Sign In / Providers → Email → "Confirm email".
  On = customers must click a link in an email before they can sign in. Off = they can sign in right away.
- Products, categories and orders you created earlier in the browser are **not** copied over —
  the database starts with a small starter catalogue that you can edit from the admin panel.
