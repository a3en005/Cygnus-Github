"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, UserIcon, LogOut, Menu, X, Home, Database, BarChart3, Shield } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Get user profile
        const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

        setUserProfile(profile)
      }
      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: UserIcon },
    ...(userProfile?.role === "admin"
      ? [
          { name: "Search Engines", href: "/admin/search-engines", icon: Database },
          { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ]
      : []),
  ]

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-md border-r border-white/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image src="/images/icon.png" alt="Cygnus Icon" width={32} height={32} className="rounded-lg" />
              <Image src="/images/logo.png" alt="Cygnus" width={120} height={32} className="h-8 w-auto" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600/80 text-white backdrop-blur-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info in sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>                
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="bg-black/20 backdrop-blur-md border-b border-white/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white hover:bg-white/10"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden md:flex items-center space-x-2 text-sm text-white/80">
                  <Search className="h-4 w-4" />
                  <span>Search Portal</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-black/90 backdrop-blur-md border-white/20 text-white"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {user?.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-white/70">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <Search className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {userProfile?.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-white/20" />
                        <DropdownMenuItem asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                          <Link href="/admin/search-engines" className="flex items-center cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
