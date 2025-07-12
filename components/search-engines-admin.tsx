"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  Globe,
  Building,
  User,
  Shield,
  DollarSign,
} from "lucide-react"

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

interface SearchEnginesAdminProps {
  searchEngines: SearchEngine[]
  onUpdate: () => void
  loading: boolean
}

export function SearchEnginesAdmin({ searchEngines, onUpdate, loading }: SearchEnginesAdminProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCountry, setFilterCountry] = useState("all")
  const [filterActive, setFilterActive] = useState("all")
  const [editingEngine, setEditingEngine] = useState<SearchEngine | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const supabase = createClient()

  // Filter and search engines
  const filteredEngines = useMemo(() => {
    return searchEngines.filter((engine) => {
      const matchesSearch =
        engine.source_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engine.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = filterType === "all" || engine.type === filterType
      const matchesCountry = filterCountry === "all" || engine.country === filterCountry
      const matchesActive =
        filterActive === "all" ||
        (filterActive === "active" && engine.active) ||
        (filterActive === "inactive" && !engine.active)

      return matchesSearch && matchesType && matchesCountry && matchesActive
    })
  }, [searchEngines, searchTerm, filterType, filterCountry, filterActive])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "people":
      case "individual":
        return <User className="h-4 w-4" />
      case "business":
      case "corporate":
        return <Building className="h-4 w-4" />
      case "investment_advisory":
        return <DollarSign className="h-4 w-4" />
      case "foundation":
        return <Shield className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const handleSaveEngine = async (engineData: Partial<SearchEngine>) => {
    try {
      setError("")
      setSuccess("")

      if (editingEngine) {
        // Update existing engine
        const { error } = await supabase.from("search_engines").update(engineData).eq("id", editingEngine.id)

        if (error) throw error
        setSuccess("Search engine updated successfully")
      } else {
        // Create new engine
        const { error } = await supabase.from("search_engines").insert([engineData])

        if (error) throw error
        setSuccess("Search engine created successfully")
      }

      setIsDialogOpen(false)
      setEditingEngine(null)
      onUpdate()
    } catch (err: any) {
      setError(err.message || "Failed to save search engine")
    }
  }

  const handleDeleteEngine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this search engine?")) return

    try {
      setError("")
      const { error } = await supabase.from("search_engines").delete().eq("id", id)

      if (error) throw error
      setSuccess("Search engine deleted successfully")
      onUpdate()
    } catch (err: any) {
      setError(err.message || "Failed to delete search engine")
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      setError("")
      const { error } = await supabase.from("search_engines").update({ active }).eq("id", id)

      if (error) throw error
      onUpdate()
    } catch (err: any) {
      setError(err.message || "Failed to update search engine")
    }
  }

  const openEditDialog = (engine?: SearchEngine) => {
    setEditingEngine(engine || null)
    setIsDialogOpen(true)
  }

  const uniqueTypes = [...new Set(searchEngines.map((e) => e.type))]
  const uniqueCountries = [...new Set(searchEngines.map((e) => e.country))]

  return (
    <div className="space-y-6">
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

      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Search Engine Management</CardTitle>
              <CardDescription className="text-white/70">
                Manage search engines, their configurations, and availability
              </CardDescription>
            </div>
            <Button onClick={() => openEditDialog()} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Engine
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-white/90">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search engines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Country</Label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Status</Label>
              <Select value={filterActive} onValueChange={setFilterActive}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-white/70">
            Showing {filteredEngines.length} of {searchEngines.length} search engines
          </div>

          {/* Engines Table */}
          <div className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-white/90">Name</TableHead>
                  <TableHead className="text-white/90">Type</TableHead>
                  <TableHead className="text-white/90">Country</TableHead>
                  <TableHead className="text-white/90">Priority</TableHead>
                  <TableHead className="text-white/90">Status</TableHead>
                  <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-white/70 py-8">
                      Loading search engines...
                    </TableCell>
                  </TableRow>
                ) : filteredEngines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-white/70 py-8">
                      No search engines found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEngines.map((engine) => (
                    <TableRow key={engine.id} className="border-white/20 hover:bg-white/5">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-white flex items-center gap-2">
                            {getTypeIcon(engine.type)}
                            {engine.source_name}
                          </div>
                          <div className="text-xs text-white/70 line-clamp-1">{engine.description}</div>
                          <div className="flex flex-wrap gap-1">
                            {engine.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {engine.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                                +{engine.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-400/30">
                          {engine.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-white/60" />
                          <span className="text-white/90">{engine.country}</span>
                        </div>
                        {engine.state_codes.length > 0 && (
                          <div className="text-xs text-white/70 mt-1">{engine.state_codes.join(", ")}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={engine.priority >= 9 ? "default" : "secondary"}
                          className={
                            engine.priority >= 9 ? "bg-green-600/80 text-green-100" : "bg-gray-600/80 text-gray-200"
                          }
                        >
                          {engine.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={engine.active}
                            onCheckedChange={(checked) => handleToggleActive(engine.id, checked)}
                          />
                          <span className="text-xs text-white/70">{engine.active ? "Active" : "Inactive"}</span>
                        </div>
                        {engine.is_free && (
                          <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-400 mt-1">
                            FREE
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(engine.source_url, "_blank")}
                            className="text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(engine)}
                            className="text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEngine(engine.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-md border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEngine ? "Edit Search Engine" : "Add New Search Engine"}</DialogTitle>
            <DialogDescription className="text-white/70">
              {editingEngine ? "Update the search engine configuration" : "Add a new search engine to the database"}
            </DialogDescription>
          </DialogHeader>
          <SearchEngineForm engine={editingEngine} onSave={handleSaveEngine} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Search Engine Form Component
function SearchEngineForm({
  engine,
  onSave,
  onCancel,
}: {
  engine: SearchEngine | null
  onSave: (data: Partial<SearchEngine>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    type: engine?.type || "general",
    country: engine?.country || "USA",
    source_name: engine?.source_name || "",
    source_url: engine?.source_url || "",
    description: engine?.description || "",
    tags: engine?.tags?.join(", ") || "",
    state_codes: engine?.state_codes?.join(", ") || "",
    features: engine?.features?.join(", ") || "",
    priority: engine?.priority || 5,
    is_free: engine?.is_free ?? true,
    active: engine?.active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const processedData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      state_codes: formData.state_codes
        .split(",")
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
      features: formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
    }

    onSave(processedData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source Name *</Label>
          <Input
            value={formData.source_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_name: e.target.value }))}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="investment_advisory">Investment Advisory</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Source URL *</Label>
        <Input
          type="url"
          value={formData.source_url}
          onChange={(e) => setFormData((prev) => ({ ...prev, source_url: e.target.value }))}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Country</Label>
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
        <div className="space-y-2">
          <Label>Priority (1-10)</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.priority}
            onChange={(e) => setFormData((prev) => ({ ...prev, priority: Number.parseInt(e.target.value) || 5 }))}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags (comma-separated)</Label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
          placeholder="e.g., CA, business, corporate"
        />
      </div>

      <div className="space-y-2">
        <Label>State Codes (comma-separated)</Label>
        <Input
          value={formData.state_codes}
          onChange={(e) => setFormData((prev) => ({ ...prev, state_codes: e.target.value }))}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
          placeholder="e.g., CA, NY, TX"
        />
      </div>

      <div className="space-y-2">
        <Label>Features (comma-separated)</Label>
        <Input
          value={formData.features}
          onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
          placeholder="e.g., registration, officers, status"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.is_free}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_free: checked }))}
          />
          <Label>Free Service</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
          />
          <Label>Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {engine ? "Update" : "Create"} Engine
        </Button>
      </div>
    </form>
  )
}
