import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Darker overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/icon.png" alt="Cygnus Icon" width={40} height={40} className="rounded-full" />
              <Image src="/images/logo.png" alt="Cygnus Logo" width={120} height={32} className="h-8 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Entity Lookup <span className="text-yellow-400">Assistant</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            The Most Comprehensive Search Platform for Professionals
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* People Search */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">People Search</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Search across multiple people databases including WhitePages, Spokeo, and BeenVerified for
                  comprehensive individual records.
                </p>
              </CardContent>
            </Card>

            {/* Company Records */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Company Records</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Access Secretary of State databases across all 50 states for business registrations, filings, and
                  corporate information.
                </p>
              </CardContent>
            </Card>

            {/* Compliance & Security */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Compliance & Security</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  All searches are logged and conducted through official channels with enterprise-grade security and
                  compliance measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
