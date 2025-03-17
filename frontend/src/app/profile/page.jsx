"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"
import { User, Shield, CheckCircle, Award } from "lucide-react"

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
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
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex justify-center items-center mb-4 bg-primary/10 p-3 rounded-full">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
          Agent Profile
        </h1>
        <p className="text-muted-foreground">Your IMF credentials and clearance</p>
      </motion.div>

      <motion.div
        className="card relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 z-0" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 z-0" />

        <div className="relative z-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {user?.username}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium text-lg capitalize flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Clearance Level</p>
                <p className="font-medium text-lg flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  {user?.role === "admin" ? "Top Secret" : "Secret"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium text-lg text-green-500 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> All actions performed in the IMF Gadget System are logged and monitored.
                Unauthorized access or misuse of gadgets is strictly prohibited and may result in immediate termination.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

