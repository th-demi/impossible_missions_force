"use client"

import Link from "next/link"
import { getStatusColor, getProbabilityColor, formatDate } from "../utils/helpers"
import { motion } from "framer-motion"
import { Info, Edit, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const GadgetCard = ({ gadget, isAdmin = false }) => {
  return (
    <motion.div
      className="card overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 z-0" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full -ml-8 -mb-8 z-0" />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {gadget.name}
          </h3>
          <Badge variant="outline" className={`${getStatusColor(gadget.status)} transition-all duration-300`}>
            {gadget.status}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-1 mt-2">
          Codename: <span className="font-mono bg-muted/50 px-1 rounded">{gadget.codename}</span>
        </div>

        <div className="text-sm text-muted-foreground mb-3 flex items-center">
          <span>Mission Success Rate:</span>
          <span className={`ml-1 font-semibold ${getProbabilityColor(gadget.successProbability)}`}>
            <span className="inline-flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {gadget.successProbability}%
            </span>
          </span>
        </div>

        <p className="text-sm mb-4 line-clamp-2 transition-all duration-300">
          {gadget.description}
        </p>

        {gadget.decommissionedAt && (
          <div className="text-xs text-muted-foreground mb-3">
            Decommissioned: {formatDate(gadget.decommissionedAt)}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <Link
            href={`/gadgets/${gadget.id}`}
            className="btn-secondary text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            <Info className="h-4 w-4" />
            <span>Details</span>
          </Link>

          {isAdmin && gadget.status !== "Destroyed" && gadget.status !== "Decommissioned" && (
            <Link
              href={`/gadgets/${gadget.id}?edit=true`}
              className="btn-primary text-sm inline-flex items-center gap-1 hover:gap-2 transition-all duration-300"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default GadgetCard

