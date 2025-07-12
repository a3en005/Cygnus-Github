// Site configuration
export const siteConfig = {
  name: "Cygnus Search Portal",
  description: "The Most Comprehensive Search Platform for Professionals",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://portalcyg.vercel.app/",
  }

// Supabase configuration
export const supabaseConfig = {
  url: "https://pckazwgsfttjmbpvjbdo.supabase.co/",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBja2F6d2dzZnR0am1icHZqYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDY0OTAsImV4cCI6MjA2NzkyMjQ5MH0.dE7XEgWGVyMvmCt10wIEaLngL3JT1zNsEFeMEh2n9Vk",
}

// Email configuration
export const emailConfig = {
  from: "noreply@portalcyg.vercel.app",
  replyTo: "support@portalcyg.vercel.app",
  baseUrl: siteConfig.url,
}

// API configuration
export const apiConfig = {
  baseUrl: `${siteConfig.url}/api`,
  timeout: 30000,
}

// Auth configuration
export const authConfig = {
  // Email confirmation settings
  requireEmailConfirmation: true,
  allowInstantActivation: false, // Set to true for development

  // Redirect URLs
  signInRedirect: "/dashboard",
  signUpRedirect: "/auth/callback",
  signOutRedirect: "/",

  // Password requirements
  passwordMinLength: 6,

  // Session settings
  sessionTimeout: 24 * 60 * 60, // 24 hours in seconds

  // Rate limiting
  rateLimiting: {
    enabled: true,
    maxAttempts: 5,
    windowMinutes: 15,
  },
}

// Environment validation
export function validateEnvironment() {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_URL"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing)
    return false
  }

  return true
}

// Initialize environment validation
if (typeof window === "undefined") {
  // Only run on server side
  validateEnvironment()
}
