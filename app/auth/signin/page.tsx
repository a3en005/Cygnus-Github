import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/components/auth-form"
import Image from "next/image"

export default function SignInPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/images/icon.png" alt="Cygnus Icon" width={40} height={40} className="rounded-full" />
              <Image src="/images/logo.png" alt="Cygnus Logo" width={120} height={32} className="h-8 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-200">
              Sign in to your Cygnus account to access the search portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="signin" />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-200">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 underline">
                  Sign up
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-200">
                <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300 underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
