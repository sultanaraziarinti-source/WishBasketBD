// Admin login used ONLY in demo mode (no Supabase keys in .env.local).
// With Supabase connected, the admin signs in with their Supabase Auth account instead.
//
// The demo password comes from NEXT_PUBLIC_DEMO_ADMIN_PASSWORD in .env.local so it is never
// committed. Without it, demo-mode admin login is disabled.
export const DEFAULT_ADMIN = {
  email: "bdwishbasket@gmail.com",
  password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
};
