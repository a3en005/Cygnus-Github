'use client'
import { useEffect, useState } from 'react'
import { supabase } from "../../lib/supabaseClient"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setName(data.user?.user_metadata?.name || "")
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    const { error } = await supabase.auth.updateUser({
      data: { name }
    })
    if (error) setMessage(error.message)
    else setMessage("Saved!")
    setSaving(false)
  }

  if (!user) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSave} className="glass-box p-6 rounded-xl flex flex-col gap-4">
        <div>
          <label className="font-medium">Email:</label>
          <input className="input" value={user.email} disabled />
        </div>
        <div>
          <label className="font-medium">Name:</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <button className="btn-primary mt-2" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        {message && <div className="text-green-700">{message}</div>}
      </form>
    </div>
  )
}