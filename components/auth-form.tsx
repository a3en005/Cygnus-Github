"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

type Mode = "signin" | "signup"

export interface AuthFormProps {
  mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [initError, setInitError] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  // Initialize Supabase client
  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
      console.log("✅ Supabase client initialized in AuthForm")
    } catch (error: any) {
      console.error("❌ Failed to initialize Supabase client:", error)
      setInitError(error.message || "Failed to initialize authentication")
    }
  }, [])

  // Show initialization error if Supabase client failed to load
  if (initError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuration Error:</strong> {initError}
          <br />
          <small>Please check your Supabase configuration and try again.</small>
        </AlertDescription>
      </Alert>
    )
  }

  // Show loading while Supabase client is initializing
  if (!supabase) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="ml-2 text-white">Initializing...</span>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    setSuccess(false)

    try {
      if (mode === "signin") {
        console.log("🔐 Attempting sign in for:", email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          console.error("❌ Sign in error:", error)
          setError(error.message)
        } else if (data.user) {
          console.log("✅ Sign in successful:", data.user.email)
          setSuccess(true)
          setMessage("Sign in successful! Redirecting...")
          setTimeout(() => router.push("/dashboard"), 1500)
        }
      } else {
        console.log("📝 Attempting sign up for:", email)

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cygnus-portal.vercel.app"}/auth/callback`,
          },
        })

        if (error) {
          console.error("❌ Sign up error:", error)
          setError(error.message)
        } else if (data.user) {
          console.log("✅ Sign up successful:", data.user.email)
          setSuccess(true)

          if (data.user.email_confirmed_at) {
            setMessage("Account created successfully! Redirecting...")
            setTimeout(() => router.push("/dashboard"), 1500)
          } else {
            setMessage("Account created! Please check your email to confirm your account before signing in.")
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success && message) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
          <CheckCircle className="h-4 w-4 text-green-300" />
          <AlertDescription className="text-green-200">{message}</AlertDescription>
        </Alert>

        {mode === "signup" && !message.includes("Redirecting") && (
          <div className="text-center">
            <p className="text-sm text-white/80 mb-4">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false)
                setMessage("")
                setEmail("")
                setPassword("")
                setFullName("")
              }}
              className="text-white border-white/30 hover:bg-white/10"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 text-red-300" />
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-white/90">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="h-12 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-white/90">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-12 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-white/90">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
            minLength={6}
            className="h-12 pr-12 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {mode === "signup" && <p className="text-xs text-white/60">Must be at least 6 characters long</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base border-0"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            {mode === "signin" ? "Signing in..." : "Creating account..."}
          </>
        ) : mode === "signin" ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
