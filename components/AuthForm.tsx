'use client'
import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

interface Props {
  mode: 'signin' | 'signup' | 'forgot'
}

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    let result
    if (mode === 'signin') {
      result = await supabase.auth.signInWithPassword({ email, password })
      if (result.error) setMessage(result.error.message)
      else setMessage("Login successful! Redirecting…")
    } else if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password })
      if (result.error) setMessage(result.error.message)
      else setMessage("Signup successful! Check your email to verify.")
    } else if (mode === 'forgot') {
      result = await supabase.auth.resetPasswordForEmail(email)
      if (result.error) setMessage(result.error.message)
      else setMessage("Check your email for password reset instructions.")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center text-blue-900">
        {mode === "signin" && "Sign In"}
        {mode === "signup" && "Sign Up"}
        {mode === "forgot" && "Forgot Password"}
      </h2>
      <input
        type="email"
        placeholder="Email"
        required
        className="input"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {mode !== 'forgot' &&
        <input
          type="password"
          placeholder="Password"
          required
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      }
      <button
        className="btn-primary w-full mt-2"
        type="submit"
        disabled={loading}
      >
        {loading ? "Please wait..." : 
          mode === "signin" ? "Sign In" : 
          mode === "signup" ? "Sign Up" : "Send Reset Link"}
      </button>
      {message && <div className="text-center text-red-600">{message}</div>}
      <div className="flex justify-between mt-2">
        {mode !== "signin" && <a className="link" href="/auth/signin">Sign In</a>}
        {mode !== "signup" && <a className="link" href="/auth/signup">Sign Up</a>}
        {mode !== "forgot" && <a className="link" href="/auth/forgot">Forgot Password?</a>}
      </div>
    </form>
  )
}