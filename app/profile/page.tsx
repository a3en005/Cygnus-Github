"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { UserIcon, Shield, Search, Clock, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  updated_at: string
}

interface SearchLog {
  id: string
  search_type: string
  search_query: any
  engines_used: string[]
  results_count: number
  timestamp: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)
      setFormData({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
      })

      // Fetch user profile
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch recent search logs
      const { data: logsData } = await supabase
        .from("search_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(10)

      if (logsData) {
        setSearchLogs(logsData)
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
        },
      })

      if (error) throw error

      // Update local profile
      const { error: profileError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (profileError) throw profileError

      setSuccess("Profile updated successfully!")
      fetchUserData() // Refresh data
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case "people":
      case "individual":
        return <UserIcon className="h-4 w-4" />
      case "business":
      case "corporate":
        return <Search className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-300 mt-2">Manage your account information and view search history</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-600 bg-green-900/20">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-white">{profile?.full_name || user?.email}</h3>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                      <Badge variant="secondary" className="mt-1 bg-blue-900/30 text-blue-300">
                        {profile?.role || "User"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-white font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-800 border-gray-600 text-gray-400"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed from this interface</p>
                    </div>
                  </div>

                  <Button type="submit" disabled={updating} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search History */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Search History
                </CardTitle>
                <CardDescription className="text-gray-400">Your last 10 searches across all databases</CardDescription>
              </CardHeader>
              <CardContent>
                {searchLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No search history yet</p>
                    <p className="text-sm text-gray-500">Start searching to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">{getSearchTypeIcon(log.search_type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300">
                                {log.search_type}
                              </Badge>
                              <span className="text-sm text-gray-400">{formatDate(log.timestamp)}</span>
                            </div>
                            <div className="text-sm text-gray-300">
                              {log.search_type === "people" && log.search_query.firstName && (
                                <span>
                                  {log.search_query.firstName} {log.search_query.lastName}
                                  {log.search_query.city && ` in ${log.search_query.city}`}
                                  {log.search_query.state && `, ${log.search_query.state}`}
                                  {log.search_query.address && ` (${log.search_query.address})`}
                                </span>
                              )}
                              {log.search_type === "business" && log.search_query.businessName && (
                                <span>
                                  {log.search_query.businessName}
                                  {log.search_query.businessState && ` in ${log.search_query.businessState}`}
                                  {log.search_query.address && ` (${log.search_query.address})`}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {log.engines_used.length} engines • {log.results_count} results
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {log.results_count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Stats Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Member Since</span>
                  <span className="text-sm text-white">
                    {profile?.created_at ? formatDate(profile.created_at) : "N/A"}
                  </span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Account Type</span>
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                    {profile?.role || "User"}
                  </Badge>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Search Stats */}
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Search Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Searches</span>
                  <span className="text-lg font-bold text-white">{searchLogs.length}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">People Searches</span>
                  <span className="text-sm text-white">
                    {searchLogs.filter((log) => log.search_type === "people").length}
                  </span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Business Searches</span>
                  <span className="text-sm text-white">
                    {searchLogs.filter((log) => log.search_type === "business").length}
                  </span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Results</span>
                  <span className="text-sm text-white">
                    {searchLogs.length > 0
                      ? Math.round(searchLogs.reduce((sum, log) => sum + log.results_count, 0) / searchLogs.length)
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
