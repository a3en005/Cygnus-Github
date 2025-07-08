'use client'
import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import SearchResults from "./SearchResults"

type SearchType = "individual" | "company"

export default function SearchForm() {
  const [searchType, setSearchType] = useState<SearchType>("individual")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [companySubtype, setCompanySubtype] = useState("llc")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResults([])

    // Simulate search logic; replace with real API/search logic
    let { data, error } = await supabase
      .from("search_engine_links")
      .select("*")
      .ilike("type", searchType)
      .limit(5)

    if (error) setError(error.message)
    else setResults(data || [])
    setLoading(false)
  }

  return (
    <div>
      <form className="glass-box p-6 rounded-xl flex flex-col space-y-4 w-full max-w-xl" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-center text-gray-800">Search People & Companies</h2>
        <div className="flex space-x-4">
          <label>
            <input type="radio" name="type" value="individual"
              checked={searchType === "individual"}
              onChange={() => setSearchType("individual")}
            /> Individual
          </label>
          <label>
            <input type="radio" name="type" value="company"
              checked={searchType === "company"}
              onChange={() => setSearchType("company")}
            /> Company
          </label>
        </div>
        <input
          className="input"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required={searchType === "individual"}
        />
        <input
          className="input"
          placeholder="Address (optional)"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        {searchType === "company" && (
          <select
            className="input"
            value={companySubtype}
            onChange={e => setCompanySubtype(e.target.value)}
          >
            <option value="llc">LLC</option>
            <option value="corp">Corporation</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="other">Other</option>
          </select>
        )}
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      <SearchResults results={results} />
    </div>
  )
}