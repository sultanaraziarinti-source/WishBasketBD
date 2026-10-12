import { createClient, SupabaseClient } from "@supabase/supabase-js";

// From your Supabase project: Project Settings → API. Put them in .env.local (see .env.example).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once the Supabase keys are set; until then the site runs on browser storage. */
export const supabaseEnabled = Boolean(url && anonKey);

/** Shopper connection: customer login is remembered in this browser. */
export const supabase: SupabaseClient | null = supabaseEnabled ? createClient(url, anonKey) : null;

/**
 * Admin connection, kept separate so an admin login never leaks into the store as a "customer".
 * The session lives only in memory, so every reload / new visit asks for the admin email + password again.
 */
export const supabaseAdmin: SupabaseClient | null = supabaseEnabled
  ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: true, storageKey: "wb-admin-auth" } })
  : null;

export const IMAGE_BUCKET = "product-images";

/** Uploads (as the signed-in admin) a data-URL photo to Storage and returns its public URL. Already-uploaded URLs pass through. */
export async function uploadPhoto(src: string): Promise<string> {
  if (!supabaseAdmin || !src.startsWith("data:")) return src;
  const blob = await (await fetch(src)).blob();
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabaseAdmin.storage.from(IMAGE_BUCKET).upload(path, blob, { contentType: blob.type || "image/jpeg" });
  if (error) throw error;
  return supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
