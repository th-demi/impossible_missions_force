"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Bomb, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const GadgetForm = ({ gadget = null, onSubmit, onDelete, onSelfDestruct }) => {
  const isEditing = !!gadget

  const [formData, setFormData] = useState({
    name: gadget?.name || "",
    description: gadget?.description || "",
    status: gadget?.status || "Available",
  })

  const [confirmCode, setConfirmCode] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDecommissioning, setIsDecommissioning] = useState(false)
  const [isSelfDestructing, setIsSelfDestructing] = useState(false)
  const [showDecommissionDialog, setShowDecommissionDialog] = useState(false)
  const [showSelfDestructDialog, setShowSelfDestructDialog] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError("Failed to save gadget")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDecommissioning(true)
    try {
      await onDelete()
      setShowDecommissionDialog(false)
    } catch (err) {
      setError("Failed to decommission gadget")
    } finally {
      setIsDecommissioning(false)
    }
  }

  const handleSelfDestruct = async () => {
    setIsSelfDestructing(true)
    try {
      await onSelfDestruct(confirmCode)
      setShowSelfDestructDialog(false)
      setConfirmCode("")
    } catch (err) {
      setError("Self-destruct sequence failed")
    } finally {
      setIsSelfDestructing(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Gadget Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter gadget name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Enter detailed description of the gadget"
          />
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={formData.status} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Deployed">Deployed</SelectItem>
                <SelectItem value="Destroyed">Destroyed</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            />
          )}
          {isEditing ? "Update Gadget" : "Create Gadget"}
        </Button>
      </motion.form>

      {isEditing && (
        <motion.div
          className="border border-destructive/20 rounded-lg p-6 bg-destructive/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </h3>

          <div className="space-y-4">
            <Dialog open={showDecommissionDialog} onOpenChange={setShowDecommissionDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 hover:text-destructive gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Decommission Gadget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Decommission Gadget</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to decommission this gadget? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Decommissioning will permanently remove this gadget from active inventory.
                  </AlertDescription>
                </Alert>
                <DialogFooter className="mt-4">
                  <Button variant="ghost" onClick={() => setShowDecommissionDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDecommissioning} className="gap-2">
                    {isDecommissioning && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    )}
                    Confirm Decommission
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showSelfDestructDialog} onOpenChange={setShowSelfDestructDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={gadget?.status === "Destroyed"} className="gap-2">
                  <Bomb className="h-4 w-4" />
                  Self-Destruct Sequence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Initiate Self-Destruct</DialogTitle>
                  <DialogDescription>
                    Enter confirmation code to initiate self-destruct sequence. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="confirmCode">Confirmation Code</Label>
                  <Input
                    id="confirmCode"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    placeholder="Any code will work"
                  />
                </div>
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Self-destruct will permanently destroy this gadget. This action is irreversible.
                  </AlertDescription>
                </Alert>
                <DialogFooter className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSelfDestructDialog(false)
                      setConfirmCode("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleSelfDestruct}
                    disabled={!confirmCode || isSelfDestructing}
                    className="gap-2"
                  >
                    {isSelfDestructing && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    )}
                    Confirm Self-Destruct
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default GadgetForm