"use client"
import React, { useState, useRef, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { ProductSelector } from "@/components/Quotes/Products/ProductSelectorOrderDetail"
import type { IProduct } from "@/interfaces/products/IProduct"
import { Receipt, ShoppingBag } from "lucide-react"
import OrderMainInfo from "./OrderMainInfo"
import StoreInfo from "./StoreInfo"
import ProductsTable from "./ProductsTable"
import FinancialSummary from "./FinancialSummary"
import { deleteOrder } from "@/actions/orders/deleteOrder"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { useReactToPrint } from "react-to-print"
import { ISingleOrderResponse } from "@/interfaces/orders/IOrder"
import { useEditOrderStore } from "@/stores/order.store"
import { useRouter } from "next/navigation"
import { updateOrder } from "@/actions/orders/updateOrder"
import { Button } from "../ui/button"
import { PrintOrderView } from "./PrintOrderView"
import { useOrderInitialization } from "@/hooks/useOrderInitialization"

// Memoize components to prevent unnecessary re-renders
const MemoizedStoreInfo = React.memo(StoreInfo)
const MemoizedProductsTable = React.memo(ProductsTable)

interface Props {
    order: ISingleOrderResponse
    allProducts: IProduct[]
}

export type typeField =
    | "userID"
    | "createdAt"
    | "updatedAt"
    | "storeID"
    | "total"
    | "status"
    | "type"
    | "discount"
    | "dte"
    | "startQuote"
    | "endQuote"
    | "expiration"
    | "expirationPeriod"

export default function OrderDetail({ order, allProducts }: Props) {
    const router = useRouter()
    const { user } = useAuth()

    // Select specific state from store to minimize re-renders
    const discount = useEditOrderStore((s) => s.discount)
    const total = useEditOrderStore((s) => s.total)
    const status = useEditOrderStore((s) => s.status)
    const newProducts = useEditOrderStore((s) => s.newProducts)

    // Actions don't change, but good to be explicit/consistent
    const clearCart = useEditOrderStore((s) => s.actions.clearCart)

    // Initialize store
    useOrderInitialization(order)

    const userRole = user?.role ?? Role.Tercero
    const isAdmin = userRole === Role.Admin
    const printRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)

    const handlePrint = useReactToPrint({
        contentRef: printRef,
    })

    // Transformar datos para PrintOrderView - memoized dependent on incoming order prop
    const printOrderData = useMemo(() => {
        return {
            ...order,
            ProductVariations: order.ProductVariations.map((v) => ({
                ...v,
                quantityOrdered: v.OrderProduct.quantityOrdered,
                priceCost: v.OrderProduct.priceCost,
            })),
        }
    }, [order])

    const [showProductSelector, setShowProductSelector] = useState(false)

    // Memoize quantities
    const cantidadTotalProductos = useMemo(() => {
        return newProducts.reduce((acc, prod) => acc + prod.variation.quantity, 0)
    }, [newProducts])

    // Mostrar fecha de emisión en UTC
    const fecha = useMemo(() => {
        const createdAtDate = new Date(order.createdAt)
        return createdAtDate.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        })
    }, [order.createdAt])

    // Handler para actualizar orden
    const handleActualizarOrden = useCallback(async () => {
        try {
            setLoading(true)
            // Access current state directly to avoid subscription in render cycle
            const currentState = useEditOrderStore.getState()
            const { actions, newProducts, ...editedOrder } = currentState

            const toNewProducts = newProducts.map((p) => p.variation).filter((v) => v.quantity > 0)
            const newProductsClean = toNewProducts.map((p) => ({ ...p, priceCost: Math.round(p.priceCost) }))
            const discountVal = Number(editedOrder.discount) || 0
            const toUpdate = { ...editedOrder, discount: discountVal, newProducts: newProductsClean }

            await updateOrder(toUpdate)
            toast.success("Orden actualizada correctamente")
        } catch (e) {
            console.log(e)
            toast.error("Error al actualizar la orden")
        } finally {
            setLoading(false)
        }
    }, [])

    // Handler para eliminar la orden
    const handleDelete = useCallback(async () => {
        if (!order) return
        if (confirm("¿Estás seguro de que quieres anular esta orden?")) {
            try {
                setLoading(true)
                await deleteOrder(order.orderID)
                router.push("/home/invoices")
                toast.success("Orden anulada correctamente")
                clearCart()
            } catch (e) {
                console.log(e)
                toast.error("Error al anular la orden")
            } finally {
                setLoading(false)
            }
        }
    }, [order, router, clearCart])

    return (
        <div className="bg-white min-h-screen dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
            <div style={{ display: "none" }}>
                <PrintOrderView ref={printRef} order={printOrderData} />
            </div>
            <div className="max-w-5xl mx-auto print-container">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline text-base font-medium"
                        onClick={() => (window.location.href = "/home/invoices")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Regresar a las órdenes de compra
                    </button>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Detalles de la Orden de Compra
                    </h1>
                </div>

                <MemoizedStoreInfo store={order.Store} />

                <div className="space-y-6 pt-6">
                    <OrderMainInfo cantidadTotalProductos={cantidadTotalProductos} fecha={fecha} />

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos ({newProducts.reduce((acc, v) => acc + v.variation.quantity, 0)})
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
                                    onClick={() => router.push(`/home/order/${order.orderID}/verify`)}
                                >
                                    Verificar Productos
                                </button>
                                {isAdmin && (
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
                                        onClick={() => setShowProductSelector(true)}
                                    >
                                        Agregar más productos
                                    </button>
                                )}
                            </div>
                        </div>
                        {showProductSelector && (
                            <div className="mb-4">
                                <ProductSelector filteredProducts={allProducts} />
                                <button
                                    className="mt-2 text-sm text-gray-500 underline"
                                    onClick={() => setShowProductSelector(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                        <MemoizedProductsTable products={newProducts} />
                    </div>

                    <FinancialSummary total={total} discount={Number(discount) || 0} />

                    <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handlePrint}
                            disabled={loading}
                        >
                            Imprimir
                        </Button>

                        {isAdmin && (
                            <Button
                                disabled={loading}
                                className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={handleActualizarOrden}
                            >
                                {loading ? `Actualizando...` : `Actualizar Orden`}
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                disabled={loading || status === "Pagado"}
                                className=" bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={handleDelete}
                            >
                                Eliminar OC
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
