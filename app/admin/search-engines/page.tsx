"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard-layout"
import { SearchEnginesAdmin } from "@/components/search-engines-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, Shield, TrendingUp, Globe } from "lucide-react"

interface SearchEngine {
  id: string
  type: string
  country: string
  source_name: string
  source_url: string
  tags: string[]
  active: boolean
  description: string
  state_codes: string[]
  priority: number
  is_free: boolean
  features: string[]
  created_at: string
  updated_at: string
}

export default function AdminSearchEnginesPage() {
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    checkUserRole()
    fetchSearchEngines()
  }, [])

  const checkUserRole = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

        setUserRole(profile?.role || null)
      }
    } catch (err) {
      console.error("Error checking user role:", err)
    }
  }

  const fetchSearchEngines = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("search_engine_links")
        .select("*")
        .order("priority", { ascending: false })
        .order("source_name", { ascending: true })

      if (error) throw error
      setSearchEngines(data || [])
    } catch (err: any) {
      console.error("Error fetching search engines:", err)
      setError("Failed to load search engines")
    } finally {
      setLoading(false)
    }
  }

  if (userRole !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl max-w-md">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-white/70">You need administrator privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const getStats = () => {
    const total = searchEngines.length
    const active = searchEngines.filter((e) => e.active).length
    const free = searchEngines.filter((e) => e.is_free).length
    const byType = searchEngines.reduce(
      (acc, engine) => {
        acc[engine.type] = (acc[engine.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { total, active, free, byType }
  }

  const stats = getStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Search Engines Administration
          </h1>
          <p className="text-white/80 text-lg">Manage and configure search engine databases</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-600/50 bg-red-900/20 backdrop-blur-sm">
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Engines</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Free Sources</p>
                  <p className="text-2xl font-bold text-white">{stats.free}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Categories</p>
                  <p className="text-2xl font-bold text-white">{Object.keys(stats.byType).length}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Type Distribution */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Engine Distribution by Type</CardTitle>
            <CardDescription className="text-white/70">Overview of search engines by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byType).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-400/30">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Admin Component */}
        <SearchEnginesAdmin searchEngines={searchEngines} onUpdate={fetchSearchEngines} loading={loading} />
      </div>
    </DashboardLayout>
  )
}
