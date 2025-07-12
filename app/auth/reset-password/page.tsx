"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (!accessToken || !refreshToken) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
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
              <CardTitle className="text-2xl text-white">Password Updated!</CardTitle>
              <CardDescription className="text-white/70 text-base">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <AlertDescription className="text-green-200">
                  Your password has been updated successfully. You can now sign in with your new password.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <p className="text-white/80 text-sm mb-4">Redirecting you to sign in...</p>
                <Link href="/auth/signin" className="text-blue-300 hover:text-blue-200 underline">
                  Click here if you're not redirected automatically
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
          <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-white/80">Enter your new password below</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-white">Reset Password</CardTitle>
            <CardDescription className="text-white/70">Create a strong new password for your account</CardDescription>
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
                <Label htmlFor="password" className="text-sm font-medium text-white/90">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="h-12 pl-10 pr-12 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="h-12 pl-10 pr-12 text-base border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 focus:bg-white/10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-white/60">Must be at least 6 characters long</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base border-0"
                disabled={loading}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
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
