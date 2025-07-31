"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export default function ModalForm({ isOpen, onClose, title, children, maxWidth = "w-[80vw]" }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`w-[70vw] max-h-[90vh] overflow-hidden rounded-lg shadow-xl bg-white dark:bg-slate-800
          ${maxWidth}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogHeader className="flex flex-row justify-between items-center w-full">
            <DialogTitle className="text-xl font-semibold dark:text-white text-gray-900">{title}</DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
