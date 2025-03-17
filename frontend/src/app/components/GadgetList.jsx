"use client"

import { useState } from "react"
import GadgetCard from "./GadgetCard"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const GadgetList = ({ gadgets = [], isAdmin = false }) => {
  const [filter, setFilter] = useState("")

  const statusOptions = [
    { value: "all", label: "All Statuses" },  // Use a non-empty string for the default option
    { value: "Available", label: "Available" },
    { value: "Deployed", label: "Deployed" },
    { value: "Destroyed", label: "Destroyed" },
    { value: "Decommissioned", label: "Decommissioned" },
  ]
  
  const filteredGadgets = filter && filter !== "all" ? gadgets.filter((g) => g.status === filter) : gadgets

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground mt-1">Browse the latest Gadgets</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredGadgets.length > 0 ? (
          filteredGadgets.map((gadget) => <GadgetCard key={gadget.id} gadget={gadget} isAdmin={isAdmin} />)
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 border border-dashed rounded-lg bg-muted/30">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-muted-foreground">No gadgets found.</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default GadgetList