import { createBrowserClient } from "@supabase/ssr"
import { supabaseConfig } from "@/lib/config"

let supabaseClient: any = null

export function createClient() {
  // Use environment variables first, fallback to hardcoded config
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseConfig.url
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseConfig.anonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase configuration:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      envUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      envKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
    throw new Error("Missing Supabase configuration. Please check your environment variables.")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    throw new Error("Invalid Supabase URL format")
  }

  // Validate API key format (should be a JWT token)
  if (!supabaseAnonKey.startsWith("eyJ")) {
    throw new Error("Invalid Supabase API key format - should be a JWT token")
  }

  // Create singleton client
  if (!supabaseClient) {
    try {
      supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      })

      console.log("✅ Supabase client created successfully")
    } catch (error) {
      console.error("❌ Failed to create Supabase client:", error)
      throw error
    }
  }

  return supabaseClient
}
