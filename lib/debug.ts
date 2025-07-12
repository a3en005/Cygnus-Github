// Debug utility to check environment variables
export function checkEnvironmentVariables() {
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_URL"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error("Missing environment variables:", missing)
    return false
  }

  console.log("Environment variables check passed")
  return true
}

// Debug function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    // Test a simple query
    const { data, error } = await supabase.from("search_engine_links").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    console.log("Supabase connection test passed")
    return true
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return false
  }
}
