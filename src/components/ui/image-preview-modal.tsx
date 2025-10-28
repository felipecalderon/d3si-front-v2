"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { X } from "lucide-react"

interface ImagePreviewModalProps {
    isOpen: boolean
    onClose: () => void
    imageUrl: string
    productName: string
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, productName }: ImagePreviewModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                <DialogTitle className="sr-only">{`Vista previa de ${productName}`}</DialogTitle>
                <div className="relative w-full">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>
                    <div className="relative w-full h-[500px]">
                        <Image
                            src={imageUrl}
                            alt={productName}
                            fill
                            className="object-contain"
                            sizes="(max-width: 600px) 100vw, 600px"
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                        <h3 className="text-white font-medium text-lg">{productName}</h3>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
