"use client"
import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Scan, CheckCircle2, AlertTriangle, XCircle, RefreshCcw, Search, FilterX } from "lucide-react"
import { OrderEditItem, useEditOrderStore } from "@/stores/order.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { updateOrder } from "@/actions/orders/updateOrder"
import { toast } from "sonner"

type ItemStatus = "complete" | "missing" | "extra" | "unexpected"

interface VerificationItem {
    sku: string
    name: string
    size: string
    expectedQuantity: number
    scannedQuantity: number
}

interface ExtendedVerificationItem extends VerificationItem {
    status: ItemStatus
}

interface Props {
    orderId: string
    originalProducts: OrderEditItem[]
    allProducts: IProduct[]
}

const statusBadgeStyles: Record<ItemStatus, string> = {
    complete: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    missing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    extra: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    unexpected: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
}

const statusOrder: Record<ItemStatus, number> = {
    missing: 0,
    extra: 1,
    unexpected: 2,
    complete: 3,
}

const statusLabels: Record<ItemStatus, string> = {
    complete: "Completo",
    missing: "Faltante",
    extra: "De más",
    unexpected: "No esperado",
}

const computeStatus = (item: VerificationItem): ItemStatus => {
    if (item.expectedQuantity === 0) return "unexpected"
    if (item.scannedQuantity === item.expectedQuantity) return "complete"
    if (item.scannedQuantity < item.expectedQuantity) return "missing"
    return "extra"
}

const getStatusText = (item: VerificationItem): string => {
    if (item.expectedQuantity === 0) {
        return "No esperado"
    }
    if (item.scannedQuantity === item.expectedQuantity) {
        return "Cantidad correcta"
    }
    if (item.scannedQuantity < item.expectedQuantity) {
        return `Faltan ${item.expectedQuantity - item.scannedQuantity}`
    }
    return `${item.scannedQuantity - item.expectedQuantity} de más`
}

const renderStatusIcon = (status: ItemStatus) => {
    switch (status) {
        case "complete":
            return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        case "missing":
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />
        case "extra":
            return <AlertTriangle className="h-4 w-4 text-orange-500" />
        default:
            return <XCircle className="h-4 w-4 text-purple-500" />
    }
}

export default function ProductVerification({ orderId, originalProducts, allProducts }: Props) {
    const router = useRouter()
    const [barcodeSku, setBarcodeSku] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all")
    const [scannedProducts, setScannedProducts] = useState<Map<string, number>>(new Map())
    const [updating, setUpdating] = useState(false)
    const { actions: storeActions } = useEditOrderStore()

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

    const extendedList = useMemo<ExtendedVerificationItem[]>(() => {
        return verificationList.map((item) => ({ ...item, status: computeStatus(item) }))
    }, [verificationList])

    const stats = useMemo(() => {
        const statusByItems: Record<ItemStatus, number> = {
            complete: 0,
            missing: 0,
            extra: 0,
            unexpected: 0,
        }
        let completeUnits = 0
        let missingUnits = 0
        let extraUnits = 0
        let unexpectedUnits = 0
        let totalExpectedUnits = 0
        let verifiedExpectedUnits = 0

        extendedList.forEach((item) => {
            statusByItems[item.status] += 1
            if (item.expectedQuantity > 0) {
                totalExpectedUnits += item.expectedQuantity
                verifiedExpectedUnits += Math.min(item.expectedQuantity, item.scannedQuantity)
            }

            if (item.status === "complete") {
                completeUnits += item.expectedQuantity
            } else if (item.status === "missing") {
                missingUnits += item.expectedQuantity - item.scannedQuantity
            } else if (item.status === "extra") {
                extraUnits += item.scannedQuantity - item.expectedQuantity
            } else {
                unexpectedUnits += item.scannedQuantity
            }
        })

        const progress = totalExpectedUnits === 0 ? 0 : Math.round((verifiedExpectedUnits / totalExpectedUnits) * 100)

        return {
            completeUnits,
            missingUnits,
            extraUnits,
            unexpectedUnits,
            totalExpectedUnits,
            verifiedExpectedUnits,
            progress,
            statusByItems,
        }
    }, [extendedList])

    const filterOptions = useMemo(
        () => [
            { value: "all" as const, label: "Todos", count: extendedList.length },
            { value: "missing" as const, label: "Faltantes", count: stats.statusByItems.missing },
            { value: "extra" as const, label: "De más", count: stats.statusByItems.extra },
            { value: "unexpected" as const, label: "No esperados", count: stats.statusByItems.unexpected },
            { value: "complete" as const, label: "Completos", count: stats.statusByItems.complete },
        ],
        [extendedList.length, stats.statusByItems]
    )

    const filteredList = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()

        return extendedList
            .filter((item) => {
                const matchesStatus = statusFilter === "all" || item.status === statusFilter
                const matchesSearch =
                    term.length === 0 || item.name.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term)
                return matchesStatus && matchesSearch
            })
            .sort((a, b) => {
                const statusDifference = statusOrder[a.status] - statusOrder[b.status]
                if (statusDifference !== 0) return statusDifference
                return a.name.localeCompare(b.name)
            })
    }, [extendedList, searchTerm, statusFilter])

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
                storeActions.updateQuantity(item.variation.sku, newQty)
            })

            // 1b) Agregar a la orden los SKUs escaneados que no estaban, si existen en inventario
            scannedProducts.forEach((quantity, sku) => {
                if (!expectedProducts.has(sku)) {
                    for (const product of allProducts) {
                        const variation = product.ProductVariations.find((v) => v.sku === sku)
                        if (variation) {
                            storeActions.addProduct(product, { ...variation, quantity })
                            break
                        }
                    }
                }
            })

            // 2) Tomar el estado actualizado y enviar al backend
            const { newProducts, actions: _unusedActions, discount, ...rest } = useEditOrderStore.getState()
            const toNewProducts = newProducts
                .map((p) => p.variation)
                .filter((v) => v.quantity > 0)
                .map((variation) => ({
                    ...variation,
                    priceCost: Math.round(Number(variation.priceCost) || 0),
                }))

            const sanitizedDiscount = typeof discount === "number" ? discount : Number(discount) || 0

            await updateOrder({ ...rest, discount: sanitizedDiscount, newProducts: toNewProducts })
            toast.success("Orden actualizada con los productos verificados")
            router.push(`/home/order/${orderId}`)
        } catch (e) {
            console.error(e)
            toast.error("No se pudo actualizar la orden")
        } finally {
            setUpdating(false)
        }
    }

    const resetVerification = () => {
        setScannedProducts(new Map())
        setBarcodeSku("")
        setSearchTerm("")
        setStatusFilter("all")
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 dark:bg-slate-950">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => router.push(`/home/order/${orderId}`)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:border-slate-600"
                            aria-label="Regresar a la orden"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                <Scan className="h-4 w-4" />
                                Verificación de productos
                            </div>
                            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Orden #{orderId}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Escanea productos, revisa diferencias y sincroniza cantidades antes de actualizar la
                                orden.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={resetVerification}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/40"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            Reiniciar escaneo
                        </button>
                        <button
                            type="button"
                            onClick={applyAndUpdateOrder}
                            disabled={updating}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            {updating ? "Aplicando cambios..." : "Actualizar orden"}
                        </button>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Escanear códigos
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Usa la pistola de códigos de barras o escribe el SKU y presiona Enter.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100 dark:focus:border-blue-400"
                                        placeholder="Escanea o escribe el SKU..."
                                        value={barcodeSku}
                                        onChange={(e) => setBarcodeSku(e.target.value)}
                                        onKeyDown={handleBarcodeScan}
                                        autoFocus
                                    />
                                    <Scan className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setBarcodeSku("")}
                                    className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-200 dark:hover:bg-slate-900"
                                >
                                    Limpiar input
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumen</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Progreso basado en las unidades esperadas frente a las escaneadas.
                        </p>
                        <div className="mt-4 flex flex-col gap-4">
                            <div>
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Progreso</span>
                                    <span>{stats.progress}%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-slate-700">
                                    <div
                                        className="h-2 rounded-full bg-green-500 transition-all"
                                        style={{ width: `${stats.progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>Unidades esperadas</span>
                                    <strong>{stats.totalExpectedUnits}</strong>
                                </div>
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>Unidades verificadas</span>
                                    <strong>{stats.verifiedExpectedUnits}</strong>
                                </div>
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>Faltantes</span>
                                    <strong>{stats.missingUnits}</strong>
                                </div>
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>De más</span>
                                    <strong>{stats.extraUnits}</strong>
                                </div>
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>No esperados</span>
                                    <strong>{stats.unexpectedUnits}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-1 flex-wrap items-center gap-3">
                                <div className="relative w-full max-w-xs">
                                    <input
                                        type="search"
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100"
                                        placeholder="Buscar por nombre o SKU"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setStatusFilter(option.value)}
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
                                                statusFilter === option.value
                                                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-200"
                                                    : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-slate-700 dark:text-gray-300 dark:hover:border-slate-600"
                                            }`}
                                        >
                                            <span>{option.label}</span>
                                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                                                {option.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {(searchTerm.trim().length > 0 || statusFilter !== "all") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter("all")
                                        setSearchTerm("")
                                    }}
                                    className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-800 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
                                >
                                    <FilterX className="h-4 w-4" />
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
                            <div className="max-h-[60vh] overflow-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-700">
                                    <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-slate-950 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">Estado</th>
                                            <th className="px-4 py-3 text-center">Escaneado / Esperado</th>
                                            <th className="px-4 py-3">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                        {filteredList.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    No se encontraron productos para los filtros aplicados.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredList.map((item) => (
                                            <tr
                                                key={item.sku}
                                                className="bg-white transition hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800/70"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {item.name}
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        SKU: {item.sku} · Talla: {item.size || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                                            statusBadgeStyles[item.status]
                                                        }`}
                                                    >
                                                        {renderStatusIcon(item.status)}
                                                        {statusLabels[item.status]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-base font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.scannedQuantity} / {item.expectedQuantity || "-"}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {getStatusText(item)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Nota: Solo se aceptan SKUs existentes en el inventario. Si el SKU no está en la orden pero
                        existe en inventario, se agregará automáticamente. Si se escanean más unidades que las
                        ordenadas, la orden reflejará esas cantidades adicionales.
                    </p>
                </section>
            </div>
        </div>
    )
}
