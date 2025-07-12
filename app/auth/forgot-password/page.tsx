"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Background Image with Blur */}
        <div className="fixed inset-0 z-0">
          <Image src="/images/background.jpg" alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/icon.png" alt="Cygnus Icon" width={48} height={48} className="rounded-lg mr-3" />
              <Image src="/images/logo.png" alt="Cygnus" width={150} height={40} className="h-10 w-auto" />
            </div>
          </div>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email!</CardTitle>
              <CardDescription className="text-white/70 text-base">Password reset link sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <AlertDescription className="text-green-200">
                  We've sent a password reset link to {email}. Check your email and follow the instructions to reset
                  your password.
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-white font-semibold mb-2">What's next?</h3>
                  <ol className="text-white/80 text-sm space-y-2 text-left">
                    <li>1. Check your email inbox for a message from Cygnus</li>
                    <li>2. Click the "Reset Password" link in the email</li>
                    <li>3. Create a new password</li>
                    <li>4. Sign in with your new password</li>
                  </ol>
                </div>

                <div className="text-white/70 text-sm">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <button onClick={() => setSuccess(false)} className="text-blue-300 hover:text-blue-200 underline">
                    try again
                  </button>
                </div>
              </div>

              <div className="text-center">
                <Link href="/auth/signin" className="text-white/80 hover:text-white font-medium">
                  ← Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-white/60 mt-6">© 2024 Cygnus. All rights reserved.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image with Blur */}
      <div className="fixed inset-0 z-0">
        <Image src="/images/background.jpg" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Image src="/images/icon.png" alt="Cygnus Icon" width={48} height={48} className="rounded-lg mr-3" />
            <Image src="/images/logo.png" alt="Cygnus" width={150} height={40} className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-white/80">Enter your email to receive a reset link</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-white">Forgot Password</CardTitle>
            <CardDescription className="text-white/70">We'll send you a link to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/90">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12 pl-10 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base border-0"
                disabled={loading}
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/70">Remember your password?</span>
                </div>
              </div>
              <div className="text-center">
                <Link href="/auth/signin" className="text-white/80 hover:text-white font-medium">
                  Back to Sign In →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-white/60 mt-6">© 2024 Cygnus. All rights reserved.</div>
      </div>
    </div>
  )
}
