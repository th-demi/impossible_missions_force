"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import { Fingerprint, LogOut, Menu, X, User, Briefcase, Plus, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="bg-primary/10 dark:bg-black/90 text-foreground dark:text-white shadow-lg backdrop-blur-sm sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl flex items-center gap-2 group">
              <Fingerprint className="h-6 w-6 text-primary group-hover:animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                IMF Gadget System
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/gadgets"
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Gadgets</span>
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/gadgets/new"
                    className="text-foreground dark:text-white hover:text-primary transition-colors duration-200 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Gadget</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-full text-foreground dark:text-white hover:text-primary dark:hover:text-primary"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 transition-all" />
                ) : (
                  <Sun className="h-4 w-4 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-foreground dark:text-white"
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <button onClick={toggleMenu} className="text-foreground dark:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 dark:bg-black/95 backdrop-blur-sm border-t border-primary/20 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/gadgets"
                  className="block text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Gadgets</span>
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/gadgets/new"
                    className="block text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2 flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Gadget</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-foreground dark:text-white hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar