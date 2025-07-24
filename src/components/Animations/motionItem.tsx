"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface MotionItemProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function MotionItem({ children, delay = 0, className = "" }: MotionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.25, 0.25, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
