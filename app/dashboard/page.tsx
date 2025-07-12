"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  ExternalLink,
  Building,
  User,
  Globe,
  Clock,
  TrendingUp,
  Database,
  Shield,
  DollarSign,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

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
}

interface SearchResult {
  engine: SearchEngine
  searchUrl: string
}

export default function Dashboard() {
  const [searchType, setSearchType] = useState("people")
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [formData, setFormData] = useState({
    // People search fields
    firstName: "",
    lastName: "",
    city: "",
    state: "",

    // Business search fields
    businessName: "",
    businessState: "",
    businessType: "",

    // General fields
    country: "USA",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchSearchEngines()
  }, [])

  const fetchSearchEngines = async () => {
    try {
      const { data, error } = await supabase
        .from("search_engines")
        .select("*")
        .eq("active", true)
        .order("priority", { ascending: false })

      if (error) throw error
      setSearchEngines(data || [])
    } catch (err: any) {
      console.error("Error fetching search engines:", err)
      setError("Failed to load search engines")
    }
  }

  const getRelevantEngines = () => {
    return searchEngines
      .filter((engine) => {
        // Filter by search type
        if (searchType === "people" && !["people", "individual", "general"].includes(engine.type)) {
          return false
        }
        if (searchType === "business" && !["business", "corporate", "general"].includes(engine.type)) {
          return false
        }
        if (searchType === "investment_advisory" && engine.type !== "investment_advisory") {
          return false
        }
        if (searchType === "foundation" && engine.type !== "foundation") {
          return false
        }

        // Filter by country
        if (engine.country !== formData.country) {
          return false
        }

        // Filter by state for business searches
        if (searchType === "business" && formData.businessState && engine.state_codes.length > 0) {
          return engine.state_codes.includes(formData.businessState.toUpperCase())
        }

        return true
      })
      .slice(0, 15) // Limit to top 15 results
  }

  const buildSearchUrl = (engine: SearchEngine) => {
    // This is a simplified URL builder - in a real app, you'd have specific URL patterns for each engine
    const baseUrl = engine.source_url
    const params = new URLSearchParams()

    if (searchType === "people") {
      if (formData.firstName) params.append("first_name", formData.firstName)
      if (formData.lastName) params.append("last_name", formData.lastName)
      if (formData.city) params.append("city", formData.city)
      if (formData.state) params.append("state", formData.state)
    } else if (searchType === "business") {
      if (formData.businessName) params.append("business_name", formData.businessName)
      if (formData.businessState) params.append("state", formData.businessState)
      if (formData.businessType) params.append("entity_type", formData.businessType)
    }

    // For demo purposes, just return the base URL
    // In production, you'd implement specific URL building logic for each search engine
    return baseUrl
  }

  const handleSearch = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate required fields
      if (searchType === "people" && (!formData.firstName || !formData.lastName)) {
        throw new Error("First name and last name are required for people search")
      }
      if (searchType === "business" && !formData.businessName) {
        throw new Error("Business name is required for business search")
      }

      const relevantEngines = getRelevantEngines()

      if (relevantEngines.length === 0) {
        throw new Error("No search engines available for your criteria")
      }

      // Build search results
      const results: SearchResult[] = relevantEngines.map((engine) => ({
        engine,
        searchUrl: buildSearchUrl(engine),
      }))

      setSearchResults(results)

      // Log the search
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("search_logs").insert({
          user_id: user.id,
          search_type: searchType,
          search_query: formData,
          engines_used: relevantEngines.map((e) => e.source_name),
          results_count: results.length,
        })
      }

      setSuccess(`Found ${results.length} search engines for your query`)
    } catch (err: any) {
      setError(err.message || "Search failed")
    } finally {
      setLoading(false)
    }
  }

  const openSearchResult = (result: SearchResult) => {
    window.open(result.searchUrl, "_blank", "noopener,noreferrer")
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      city: "",
      state: "",
      businessName: "",
      businessState: "",
      businessType: "",
      country: "USA",
      notes: "",
    })
    setSearchResults([])
    setError("")
    setSuccess("")
  }

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case "people":
        return <User className="h-4 w-4" />
      case "business":
        return <Building className="h-4 w-4" />
      case "investment_advisory":
        return <DollarSign className="h-4 w-4" />
      case "foundation":
        return <Shield className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Search Portal
          </h1>
          <p className="text-white/80 text-lg">Find people and businesses across multiple databases</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-600/50 bg-green-900/20 backdrop-blur-sm">
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="border-red-600/50 bg-red-900/20 backdrop-blur-sm">
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Form */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Configuration
            </CardTitle>
            <CardDescription className="text-white/70">
              Configure your search parameters and select databases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Type Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Search Type</Label>
              <RadioGroup value={searchType} onValueChange={setSearchType} className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="people" id="people" className="border-white/50 text-white" />
                  <Label htmlFor="people" className="text-white/90 flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    People Search
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" className="border-white/50 text-white" />
                  <Label htmlFor="business" className="text-white/90 flex items-center gap-2 cursor-pointer">
                    <Building className="h-4 w-4" />
                    Business Search
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="investment_advisory"
                    id="investment_advisory"
                    className="border-white/50 text-white"
                  />
                  <Label htmlFor="investment_advisory" className="text-white/90 flex items-center gap-2 cursor-pointer">
                    <DollarSign className="h-4 w-4" />
                    Investment Advisory
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="foundation" id="foundation" className="border-white/50 text-white" />
                  <Label htmlFor="foundation" className="text-white/90 flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    Foundation/Nonprofit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-white font-medium">
                Country
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="CANADA">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* People Search Fields */}
            {searchType === "people" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white font-medium">
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter state (e.g., CA, NY, ON)"
                  />
                </div>
              </div>
            )}

            {/* Business Search Fields */}
            {searchType === "business" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessName" className="text-white font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessState" className="text-white font-medium">
                    State
                  </Label>
                  <Input
                    id="businessState"
                    value={formData.businessState}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessState: e.target.value }))}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                    placeholder="Enter state (e.g., CA, NY)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-white font-medium">
                    Business Type
                  </Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Investment Advisory and Foundation searches don't need additional fields */}
            {(searchType === "investment_advisory" || searchType === "foundation") && (
              <div className="space-y-2">
                <Label htmlFor="entityName" className="text-white font-medium">
                  {searchType === "investment_advisory" ? "Advisor/Firm Name *" : "Organization Name *"}
                </Label>
                <Input
                  id="entityName"
                  value={formData.businessName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                  placeholder={
                    searchType === "investment_advisory" ? "Enter advisor or firm name" : "Enter organization name"
                  }
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20 resize-none"
                placeholder="Add any additional search notes..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Databases
                  </>
                )}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Search Results ({searchResults.length})
              </CardTitle>
              <CardDescription className="text-white/70">
                Click on any result to open the search engine in a new tab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result, index) => (
                  <Card
                    key={result.engine.id}
                    className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => openSearchResult(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white text-sm leading-tight group-hover:text-blue-300 transition-colors">
                          {result.engine.source_name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge
                            variant={result.engine.priority >= 9 ? "default" : "secondary"}
                            className={`text-xs ${
                              result.engine.priority >= 9
                                ? "bg-green-600/80 text-green-100"
                                : "bg-gray-600/80 text-gray-200"
                            }`}
                          >
                            {result.engine.priority}
                          </Badge>
                          <ExternalLink className="h-3 w-3 text-white/60 group-hover:text-blue-300 transition-colors" />
                        </div>
                      </div>

                      <p className="text-xs text-white/70 mb-3 line-clamp-2">{result.engine.description}</p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300 border-blue-400/30">
                          {getSearchTypeIcon(result.engine.type)}
                          <span className="ml-1">{result.engine.type}</span>
                        </Badge>
                        {result.engine.is_free && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-900/30 text-green-400 border-green-400/30"
                          >
                            FREE
                          </Badge>
                        )}
                        {result.engine.state_codes.length > 0 && (
                          <Badge variant="outline" className="text-xs border-white/30 text-white/70">
                            {result.engine.state_codes.join(", ")}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-white/60">
                        <Globe className="h-3 w-3 mr-1" />
                        {result.engine.country}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Available Engines</p>
                  <p className="text-2xl font-bold text-white">{searchEngines.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Free Sources</p>
                  <p className="text-2xl font-bold text-white">{searchEngines.filter((e) => e.is_free).length}</p>
                </div>
                <Globe className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Last Search</p>
                  <p className="text-2xl font-bold text-white">
                    {searchResults.length > 0 ? searchResults.length : "-"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Search Type</p>
                  <p className="text-lg font-bold text-white capitalize">{searchType.replace("_", " ")}</p>
                </div>
                {getSearchTypeIcon(searchType)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
