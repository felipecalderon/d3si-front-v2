"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { Button } from '../ui/button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export default function ModalUserTienda({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
