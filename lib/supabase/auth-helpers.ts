import { createClient } from "@/lib/supabase/client"
import { createUserProfile } from "./user-setup"

export interface SignUpData {
  email: string
  password: string
  fullName: string
  metadata?: Record<string, any>
}

export interface SignUpResult {
  success: boolean
  user?: any
  error?: string
  needsConfirmation?: boolean
}

export async function signUpUser(data: SignUpData): Promise<SignUpResult> {
  const supabase = createClient()

  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          ...data.metadata,
        },
        // Use environment variable for redirect URL
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      console.error("Auth signup error:", authError)
      return {
        success: false,
        error: authError.message,
      }
    }

    if (authData.user) {
      // If user is created but needs email confirmation
      if (!authData.user.email_confirmed_at) {
        return {
          success: true,
          user: authData.user,
          needsConfirmation: true,
        }
      }

      // If user is auto-confirmed, create profile
      const profileCreated = await createUserProfile(authData.user)
      if (!profileCreated) {
        console.warn("Profile creation failed, but user was created")
      }

      return {
        success: true,
        user: authData.user,
        needsConfirmation: false,
      }
    }

    return {
      success: false,
      error: "Unknown error occurred during signup",
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function signInUser(email: string, password: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Ensure user profile exists
    if (data.user) {
      const profileCreated = await createUserProfile(data.user)
      if (!profileCreated) {
        console.warn("Profile creation/update failed during signin")
      }
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    console.error("Signin error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
