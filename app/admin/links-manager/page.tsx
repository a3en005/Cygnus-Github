'use client'
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"

type Link = {
  id: number
  type: string
  country: string
  source_name: string
  source_url: string
  tags: string[]
  active: boolean
}

const blankLink: Partial<Link> = {
  type: "",
  country: "",
  source_name: "",
  source_url: "",
  tags: [],
  active: true,
}

export default function LinksManagerPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [editing, setEditing] = useState<Partial<Link> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchLinks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("search_engine_links")
      .select("*")
      .order("id")
    if (error) setError(error.message)
    else setLinks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  const handleSave = async () => {
    setError("")
    if (!editing?.source_name || !editing?.source_url) {
      setError("Name and URL required")
      return
    }
    if (editing.id) {
      // Update
      const { error } = await supabase
        .from("search_engine_links")
        .update(editing)
        .eq("id", editing.id)
      if (error) setError(error.message)
    } else {
      // Insert
      const { error } = await supabase
        .from("search_engine_links")
        .insert([{ ...editing, tags: editing.tags || [] }])
      if (error) setError(error.message)
    }
    setEditing(null)
    fetchLinks()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this link?")) return
    const { error } = await supabase
      .from("search_engine_links")
      .delete()
      .eq("id", id)
    if (error) setError(error.message)
    fetchLinks()
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin: Manage Search Engine Links</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <button className="btn-primary mb-4" onClick={() => setEditing({ ...blankLink })}>Add New Link</button>
      {editing && (
        <div className="glass-box p-4 mb-4 rounded-xl">
          <div className="flex flex-col gap-2">
            <input className="input" placeholder="Type (individual/company)" value={editing.type || ""} onChange={e => setEditing({ ...editing, type: e.target.value })} />
            <input className="input" placeholder="Country" value={editing.country || ""} onChange={e => setEditing({ ...editing, country: e.target.value })} />
            <input className="input" placeholder="Source Name" value={editing.source_name || ""} onChange={e => setEditing({ ...editing, source_name: e.target.value })} />
            <input className="input" placeholder="Source URL" value={editing.source_url || ""} onChange={e => setEditing({ ...editing, source_url: e.target.value })} />
            <input className="input" placeholder="Tags (comma-separated)" value={editing.tags?.join(",") || ""} onChange={e => setEditing({ ...editing, tags: e.target.value.split(",").map(x => x.trim()) })} />
            <label>
              <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active
            </label>
            <div className="flex gap-2 mt-2">
              <button className="btn-primary" onClick={handleSave}>Save</button>
              <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <div>Loading...</div> : (
        <table className="w-full glass-box rounded-xl">
          <thead>
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">Country</th>
              <th className="p-2">Name</th>
              <th className="p-2">URL</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link.id}>
                <td className="p-2">{link.type}</td>
                <td className="p-2">{link.country}</td>
                <td className="p-2">{link.source_name}</td>
                <td className="p-2"><a href={link.source_url} target="_blank" className="text-blue-700 underline">{link.source_url}</a></td>
                <td className="p-2">{link.tags.join(", ")}</td>
                <td className="p-2">{link.active ? "Yes" : "No"}</td>
                <td className="p-2">
                  <button className="btn-secondary mr-2" onClick={() => setEditing(link)}>Edit</button>
                  <button className="btn-secondary" onClick={() => handleDelete(link.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}