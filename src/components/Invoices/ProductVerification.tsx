"use client"
import React, { useMemo, useState } from "react"
import { X, Scan, CheckCircle2, AlertTriangle, XCircle, RefreshCcw } from "lucide-react"
import { OrderEditItem, useEditOrderStore } from "@/stores/order.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { updateOrder } from "@/actions/orders/updateOrder"
import { toast } from "sonner"

interface VerificationItem {
    sku: string
    name: string
    size: string
    expectedQuantity: number
    scannedQuantity: number
}

interface Props {
    originalProducts: OrderEditItem[]
    allProducts: IProduct[]
    onClose: () => void
}

export default function ProductVerification({ originalProducts, allProducts, onClose }: Props) {
    const [barcodeSku, setBarcodeSku] = useState("")
    const [scannedProducts, setScannedProducts] = useState<Map<string, number>>(new Map())
    const [updating, setUpdating] = useState(false)
    const { actions } = useEditOrderStore()

    // Crear un mapa de productos esperados
    const expectedProducts = useMemo(() => {
        const map = new Map<string, VerificationItem>()
        originalProducts.forEach((item) => {
            map.set(item.variation.sku, {
                sku: item.variation.sku,
                name: item.product.name,
                size: item.variation.sizeNumber,
                expectedQuantity: item.variation.quantity,
                scannedQuantity: 0,
            })
        })
        return map
    }, [originalProducts])

    // Actualizar cantidades escaneadas
    const verificationList = useMemo(() => {
        const list: VerificationItem[] = []
        // Agregar productos esperados
        expectedProducts.forEach((item) => {
            list.push({
                ...item,
                scannedQuantity: scannedProducts.get(item.sku) || 0,
            })
        })
        // Agregar productos escaneados que no estaban en la orden original (si existen en inventario)
        scannedProducts.forEach((quantity, sku) => {
            if (!expectedProducts.has(sku)) {
                for (const product of allProducts) {
                    const variation = product.ProductVariations.find((v) => v.sku === sku)
                    if (variation) {
                        list.push({
                            sku,
                            name: product.name,
                            size: variation.sizeNumber,
                            expectedQuantity: 0,
                            scannedQuantity: quantity,
                        })
                        break
                    }
                }
            }
        })
        return list
    }, [expectedProducts, scannedProducts, allProducts])

    // Calcular estadísticas
    const stats = useMemo(() => {
        let complete = 0
        let missing = 0
        let extra = 0
        let unexpected = 0
        verificationList.forEach((item) => {
            if (item.expectedQuantity === 0) {
                unexpected += item.scannedQuantity
            } else if (item.scannedQuantity === item.expectedQuantity) {
                complete++
            } else if (item.scannedQuantity < item.expectedQuantity) {
                missing += item.expectedQuantity - item.scannedQuantity
            } else {
                extra += item.scannedQuantity - item.expectedQuantity
            }
        })

        return { complete, missing, extra, unexpected }
    }, [verificationList])

    const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const sku = barcodeSku.trim()
            if (!sku) return

            // Verificar que el SKU exista en inventario (toda la lista de productos)
            let existsInInventory = false
            for (const product of allProducts) {
                if (product.ProductVariations.some((v) => v.sku === sku)) {
                    existsInInventory = true
                    break
                }
            }

            if (!existsInInventory) {
                toast.error("El producto no se encuentra en el inventario")
                setBarcodeSku("")
                return
            }

            // Incrementar el conteo de productos escaneados
            setScannedProducts((prev) => {
                const newMap = new Map(prev)
                const currentCount = newMap.get(sku) || 0
                newMap.set(sku, currentCount + 1)
                return newMap
            })

            setBarcodeSku("")
        }
    }

    // Aplicar cantidades escaneadas al store y actualizar backend
    const applyAndUpdateOrder = async () => {
        try {
            setUpdating(true)
            // 1) Aplicar al store: actualizar cantidades para SKUs de la orden
            originalProducts.forEach((item) => {
                const scanned = scannedProducts.get(item.variation.sku) || 0
                const newQty = scanned
                actions.updateQuantity(item.variation.sku, newQty)
            })

            // 1b) Agregar a la orden los SKUs escaneados que no estaban, si existen en inventario
            scannedProducts.forEach((quantity, sku) => {
                if (!expectedProducts.has(sku)) {
                    for (const product of allProducts) {
                        const variation = product.ProductVariations.find((v) => v.sku === sku)
                        if (variation) {
                            actions.addProduct(product, { ...variation, quantity })
                            break
                        }
                    }
                }
            })

            // 2) Tomar el estado actualizado y enviar al backend
            const { newProducts, actions, discount, ...rest } = useEditOrderStore.getState()
            const toNewProducts = newProducts.map((p) => p.variation).filter((v) => v.quantity > 0)

            // Ensure discount is a number
            const sanitizedDiscount = typeof discount === "number" ? discount : Number(discount) || 0

            await updateOrder({ ...rest, discount: sanitizedDiscount, newProducts: toNewProducts })
            toast.success("Orden actualizada con los productos verificados")
            onClose()
        } catch (e) {
            console.error(e)
            toast.error("No se pudo actualizar la orden")
        } finally {
            setUpdating(false)
        }
    }

    const getStatusIcon = (item: VerificationItem) => {
        if (item.expectedQuantity === 0) {
            return <XCircle className="w-5 h-5 text-purple-500" />
        } else if (item.scannedQuantity === item.expectedQuantity) {
            return <CheckCircle2 className="w-5 h-5 text-green-500" />
        } else if (item.scannedQuantity < item.expectedQuantity) {
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />
        } else {
            return <AlertTriangle className="w-5 h-5 text-orange-500" />
        }
    }

    const getStatusText = (item: VerificationItem) => {
        if (item.expectedQuantity === 0) {
            return "No esperado"
        } else if (item.scannedQuantity === item.expectedQuantity) {
            return "Completo"
        } else if (item.scannedQuantity < item.expectedQuantity) {
            return `Faltan ${item.expectedQuantity - item.scannedQuantity}`
        } else {
            return `${item.scannedQuantity - item.expectedQuantity} de más`
        }
    }

    const resetVerification = () => {
        setScannedProducts(new Map())
        setBarcodeSku("")
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Scan className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold">Verificar Productos</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scanner Input */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Escanear código de barras
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-lg"
                            placeholder="Escanear con pistola de códigos de barra..."
                            value={barcodeSku}
                            onChange={(e) => setBarcodeSku(e.target.value)}
                            onKeyDown={handleBarcodeScan}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={resetVerification}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-sm font-medium"
                            >
                                Reiniciar Verificación
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Completos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{stats.missing}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Faltantes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{stats.extra}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">De Más</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{stats.unexpected}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">No Esperados</div>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        Nota: Solo se aceptan SKUs existentes en el inventario. Si el SKU no está en la orden pero
                        existe en inventario, se agregará. Si se escanean más unidades que las ordenadas, la orden
                        aumentará esas cantidades.
                    </p>
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-2">
                        {verificationList.map((item) => (
                            <div
                                key={item.sku}
                                className={`flex items-center justify-between p-4 rounded-lg border ${
                                    item.expectedQuantity === 0
                                        ? "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20"
                                        : item.scannedQuantity === item.expectedQuantity
                                        ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                                        : item.scannedQuantity < item.expectedQuantity
                                        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                                        : "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20"
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    {getStatusIcon(item)}
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            SKU: {item.sku} | Talla: {item.size}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg">
                                        {item.scannedQuantity} / {item.expectedQuantity || "-"}
                                    </div>
                                    <div className="text-sm font-medium">{getStatusText(item)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                        onClick={applyAndUpdateOrder}
                        disabled={updating}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded shadow inline-flex items-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        {updating ? "Actualizando..." : "Actualizar orden"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
