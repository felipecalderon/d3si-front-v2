"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Ean13Generator from "../BarcodeGenerator"
import { Button } from "@/components/ui/button"
import styles from "@/components/Inventory/TableSection/PrintbarcodeModal.module.css"
import { useEffect } from "react"

interface ProductData {
    name: string
    image: string
    storeProductID: string
    priceList: number
    stock: number
    createdAt: string
    updatedAt: string
    variationID: string
    productID: string
    sizeNumber: string
    priceCost: number
    sku: string
    stockQuantity: number
    storeID: string
    quantity: number
    priceCostStore: string
}

interface Props {
    value: ProductData
    isOpen: boolean
    onOpenChange: (newOpenState: boolean) => void
}
export function PrintbarcodeModal({ onOpenChange, isOpen, value }: Props) {
    const handlePrint = () => {
        // ID del elemento que contiene el código de barras (ya lo tienes: "printBarcode")
        const printContent = document.getElementById("printBarcode")

        if (printContent) {
            window.print()
        }
    }

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                window.print()
            }, 600)
        }
    }, [isOpen])
    if (isOpen)
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className={`${styles.hideOnPrint} sm:max-w-lg p-6`}>
                    <DialogHeader>
                        <DialogTitle>Anular Venta</DialogTitle>
                        <DialogDescription>
                            Completa el formulario para procesar la anulación de la venta.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 place-content-center gap-4 py-4">
                        <div id="printBarcode" className={styles.printOnly}>
                            <p className="text-xs text-center">
                                {value.name} - {value.sizeNumber}
                            </p>
                            <Ean13Generator value={value.sku} />
                        </div>

                        <Button variant="destructive" onClick={handlePrint}>
                            Imprimir
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
}
