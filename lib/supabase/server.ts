import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { supabaseConfig } from "@/lib/config"

export async function createClient() {
  const cookieStore = await cookies()

  // Use environment variables first, fallback to hardcoded config
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseConfig.url
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseConfig.anonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase configuration on server:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      envUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      envKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
    throw new Error("Missing Supabase configuration on server")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
