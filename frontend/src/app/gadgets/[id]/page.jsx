"use client"
import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import GadgetForm from "../../components/GadgetForm"
import { gadgets } from "../../utils/api"
import { useAuth } from "../../contexts/AuthContext"
import { getStatusColor, getProbabilityColor, formatDate } from "../../utils/helpers"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Zap, Calendar, RefreshCw, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function GadgetDetail({ params }) {
  const [gadget, setGadget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const edit = searchParams.get("edit")

  const { id } = React.use(params)

  useEffect(() => {
    if (id) {
      fetchGadgetById(id)
    }
  }, [id])

  useEffect(() => {
    if (edit === "true" && !isEditing) {
      setIsEditing(true)
    }
  }, [edit])

  const fetchGadgetById = async (id) => {
    try {
      setLoading(true)
      const { data } = await gadgets.getById(id)

      if (data?.data) {
        setGadget(data.data)
      } else {
        throw new Error("Gadget data not found in response")
      }
      setError("")
    } catch (err) {
      setError("Failed to fetch gadget details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      await gadgets.update(id, formData)
      await fetchGadgetById(id)
      setIsEditing(false)
      router.replace(`/gadgets/${id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to update gadget")
      throw err
    }
  }

  const handleDecommission = async () => {
    try {
      await gadgets.decommission(id)
      await fetchGadgetById(id)
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setError("Failed to decommission gadget")
      throw err
    }
  }

  const handleSelfDestruct = async (confirmationCode) => {
    try {
      await gadgets.selfDestruct(id, confirmationCode)
      await fetchGadgetById(id)
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setError("Failed to initiate self-destruct")
      throw err
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || !isAuthenticated) {
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/gadgets")}
          className="gap-2 hover:gap-3 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Gadgets</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mt-4" />
          <Skeleton className="h-4 w-32 mt-2" />
          <Skeleton className="h-32 w-full mt-4" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ) : error ? (
        <motion.div
          className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => router.push("/gadgets")} className="mt-4">
            Return to Gadgets
          </Button>
        </motion.div>
      ) : (
        <>
          {isAdmin() && (
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "secondary" : "default"}
                className="gap-2"
              >
                {isEditing ? (
                  <>
                    <span>Cancel Editing</span>
                  </>
                ) : (
                  <>
                    <span>Edit Gadget</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {isEditing && isAdmin() ? (
            <GadgetForm
              gadget={gadget}
              onSubmit={handleUpdate}
              onDelete={handleDecommission}
              onSelfDestruct={handleSelfDestruct}
            />
          ) : (
            <motion.div
              className="card relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 z-0" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 z-0" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    {gadget?.name}
                  </h1>
                  <Badge className={`${getStatusColor(gadget?.status)} text-sm px-3 py-1`}>{gadget?.status}</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Codename:</span>
                      <span className="font-mono bg-muted/50 px-2 py-0.5 rounded text-foreground">
                        {gadget?.codename}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Mission Success Rate:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${getProbabilityColor(gadget?.successProbability)}`}
                      >
                        <Zap className="h-4 w-4" />
                        {gadget?.successProbability}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {gadget?.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(gadget.createdAt)}</span>
                      </div>
                    )}

                    {gadget?.updatedAt && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Last Updated: {formatDate(gadget.updatedAt)}</span>
                      </div>
                    )}

                    {gadget?.decommissionedAt && (
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4" />
                        <span>Decommissioned: {formatDate(gadget.decommissionedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Description
                  </h3>
                  <p className="leading-relaxed">{gadget?.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

