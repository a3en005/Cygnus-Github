// Configuration validator utility
export interface SupabaseConfig {
  url: string
  anonKey: string
  isValid: boolean
  errors: string[]
}

export function validateSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const errors: string[] = []

  // Check if variables exist
  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing")
  }

  if (!anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
  }

  // Validate URL format
  if (url) {
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.hostname.includes("supabase")) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL")
      }
    } catch {
      errors.push("NEXT_PUBLIC_SUPABASE_URL is not a valid URL format")
    }
  }

  // Validate API key format
  if (anonKey) {
    if (anonKey.length < 100) {
      errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)")
    }

    if (!anonKey.startsWith("eyJ")) {
      errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY does not appear to be a valid JWT token")
    }
  }

  return {
    url,
    anonKey,
    isValid: errors.length === 0,
    errors,
  }
}

export function logSupabaseConfig() {
  const config = validateSupabaseConfig()

  if (config.isValid) {
    console.log("✅ Supabase configuration is valid")
  } else {
    console.error("❌ Supabase configuration errors:")
    config.errors.forEach((error) => console.error(`  - ${error}`))
  }

  return config
}
