"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

interface CollapsibleProps {
  isOpen: boolean
  children: ReactNode
}

export function Collapsible({ isOpen, children }: CollapsibleProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}