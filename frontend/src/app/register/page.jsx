"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthForm from "../components/AuthForm"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/gadgets")
    }
  }, [isAuthenticated, loading, router])

  const handleRegister = async (formData) => {
    const result = await register(formData)
    if (result.success) {
      router.push("/login")
    }
    return result
  }

  if (loading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex justify-center items-center mb-4 bg-primary/10 p-3 rounded-full">
          <UserPlus className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-muted-foreground">Join the IMF Gadget System</p>
      </motion.div>

      <div className="border rounded-lg p-6 shadow-sm">
        <AuthForm onSubmit={handleRegister} isRegister={true} />
      </div>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

