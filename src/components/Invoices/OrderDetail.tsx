"use client"
import React, { useEffect, useState, useRef } from "react"
import { toast } from "react-hot-toast"
import { ProductSelector } from "@/components/Quotes/Products/ProductSelectorOrderDetail"
import type { IProduct } from "@/interfaces/products/IProduct"
import { getAllProducts } from "@/actions/products/getAllProducts"
import type { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { Receipt, ShoppingBag } from "lucide-react"
import OrderMainInfo from "./OrderMainInfo"
import StoreInfo from "./StoreInfo"
import ProductsTable from "./ProductsTable"
import FinancialSummary from "./FinancialSummary"

interface Props {
    orderId: string
}

import { getOrderById } from "@/actions/orders/getOrderById"
import { updateOrder } from "@/actions/orders/updateOrder"
import { deleteOrder } from "@/actions/orders/deleteOrder"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { useReactToPrint } from "react-to-print"

function useOrder(orderId: string) {
    const [order, setOrder] = useState<IOrderWithStore | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrder = React.useCallback(() => {
        setLoading(true)
        setError(null)
        getOrderById(orderId)
            .then((data) => setOrder(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [orderId])

    useEffect(() => {
        fetchOrder()
    }, [orderId, fetchOrder])

    return { order, loading, error, fetchOrder }
}

export default function OrderDetail({ orderId }: Props) {
    const { order, loading, error, fetchOrder } = useOrder(orderId)
    // Estado local para forzar re-render de la tabla de productos
    const [_, setForceUpdate] = useState(0)
    const printRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: printRef,
    })

    // DTE, cuotas, y estados
    const [arrivalDate, setArrivalDate] = useState("")
    const [dteNumber, setDteNumber] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("Pendiente")
    const [currentQuota, setCurrentQuota] = useState<number | undefined>(undefined)
    const [totalQuotas, setTotalQuotas] = useState<number | undefined>(undefined)
    const [editQuotas, setEditQuotas] = useState(false)
    const paymentStates = ["Pendiente", "Enviado", "Anulado"]
    const { user } = useAuth()
    const userRole = user?.role
    const isAdmin = userRole === Role.Admin

    // Estado para mostrar el selector de productos
    const [showProductSelector, setShowProductSelector] = useState(false)
    const [allProducts, setAllProducts] = useState<IProduct[]>([])
    useEffect(() => {
        if (showProductSelector) {
            getAllProducts().then(setAllProducts)
        }
    }, [showProductSelector])

    useEffect(() => {
        if (order) {
            setPaymentStatus(order.status || "Pendiente")
            setArrivalDate(order.expiration ? order.expiration.slice(0, 10) : "")
            setDteNumber(order.dte || "")
            setCurrentQuota(
                order.startQuote != null && order.startQuote !== "" && !isNaN(Number(order.startQuote))
                    ? Number(order.startQuote)
                    : undefined
            )
            setTotalQuotas(
                order.endQuote != null && order.endQuote !== "" && !isNaN(Number(order.endQuote))
                    ? Number(order.endQuote)
                    : undefined
            )
        }
    }, [order])

    if (loading) return <div className="p-8 text-center">Cargando...</div>
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>
    if (!order) return <div className="p-8 text-center">No se encontró la orden.</div>

    // Sumar neto usando subtotal de OrderProduct
    const neto =
        order.ProductVariations?.reduce(
            (acc, item) =>
                acc +
                (item.OrderProduct
                    ? typeof item.OrderProduct.subtotal === "number"
                        ? item.OrderProduct.subtotal
                        : Number(item.OrderProduct.subtotal)
                    : 0),
            0
        ) || 0

    // Sumar cantidad total de productos solicitados
    const cantidadTotalProductos =
        order.ProductVariations?.reduce((acc, item) => acc + (item.OrderProduct?.quantityOrdered ?? 0), 0) || 0
    const iva = neto * 0.19
    const totalConIva = neto + iva
    // Mostrar fecha de emisión en UTC (sin ajuste de zona horaria local)
    const createdAtDate = new Date(order.createdAt)
    const fecha = createdAtDate.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })

    // Handler para agregar un producto seleccionado a la orden
    const handleProductSelect = (productId: string) => {
        if (!order) return
        const product = allProducts.find((p) => p.productID === productId)
        if (!product || !product.ProductVariations.length) {
            toast.error("No se encontró una variación para este producto.")
            return
        }
        const variation = product.ProductVariations[0]
        if (order.ProductVariations.some((v) => v.variationID === variation.variationID)) {
            toast.error("Este producto ya está en la orden.")
            return
        }
        order.ProductVariations.push({
            ...variation,
            priceList: String(variation.priceList),
            Product: product,
            OrderProduct: {
                quantityOrdered: 1,
                subtotal: Number(variation.priceList),
            },
            quantityOrdered: 1,
            subtotal: Number(variation.priceList),
            createdAt: variation.createdAt || new Date().toISOString(),
            updatedAt: variation.updatedAt || new Date().toISOString(),
        })
        setShowProductSelector(false)
        setForceUpdate((f) => f + 1)
        toast.success("Producto agregado a la orden.")
    }

    // Handler para guardar cambios en la orden (actualizar en backend)
    const handleActualizarOrden = async () => {
        if (!order) return
        try {
            // Convertir cuotas a string o null
            const startQuote = currentQuota !== undefined && currentQuota !== null ? String(currentQuota) : null
            const endQuote = totalQuotas !== undefined && totalQuotas !== null ? String(totalQuotas) : null
            const body = {
                orderID: order.orderID,
                status: paymentStatus,
                type: order.type,
                discount: order.discount,
                dte: dteNumber,
                startQuote,
                endQuote,
                expiration: arrivalDate ? new Date(arrivalDate).toISOString() : order.expiration,
                newProducts:
                    order.ProductVariations?.map((v) => ({
                        variationID: v.variationID,
                        productID: v.productID,
                        sizeNumber: v.sizeNumber,
                        priceList: v.priceList,
                        priceCost: v.priceCost,
                        sku: v.sku,
                        stockQuantity: v.stockQuantity,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        quantityOrdered: v.OrderProduct?.quantityOrdered ?? v.quantityOrdered,
                        subtotal: v.OrderProduct?.subtotal ?? v.subtotal,
                    })) || [],
            }
            await updateOrder(body)
            toast.success("Orden actualizada correctamente")
            setTimeout(() => {
                fetchOrder()
            }, 1200)
        } catch (e: any) {
            toast.error(e?.message || "Error al actualizar la orden")
        }
    }

    // Handler para eliminar la orden (anular OC)
    const handleDelete = async () => {
        if (!order) return
        if (confirm("¿Estás seguro de que quieres anular esta orden?")) {
            try {
                await deleteOrder(order.orderID)
                toast.success("Orden anulada correctamente")
                setTimeout(() => {
                    window.location.href = "/home/invoices"
                }, 1000)
            } catch (e: any) {
                toast.error(e?.message || "Error al anular la orden")
            }
        }
    }

    return (
        <div className="bg-white min-h-screen dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
            <div className="max-w-5xl mx-auto print-container" ref={printRef}>
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
                <StoreInfo store={order.Store} />
                <div className="space-y-6 pt-6">
                    <OrderMainInfo
                        cantidadTotalProductos={cantidadTotalProductos}
                        fecha={fecha}
                        arrivalDate={arrivalDate}
                        setArrivalDate={setArrivalDate}
                        isAdmin={isAdmin}
                        dteNumber={dteNumber}
                        setDteNumber={setDteNumber}
                        paymentStatus={paymentStatus}
                        setPaymentStatus={setPaymentStatus}
                        paymentStates={paymentStates}
                        currentQuota={currentQuota}
                        setCurrentQuota={setCurrentQuota}
                        totalQuotas={totalQuotas}
                        setTotalQuotas={setTotalQuotas}
                        editQuotas={editQuotas}
                        setEditQuotas={setEditQuotas}
                    />

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos ({order.ProductVariations?.length || 0})
                            </h3>
                            {isAdmin && (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
                                    onClick={() => setShowProductSelector(true)}
                                >
                                    Agregar más productos
                                </button>
                            )}
                        </div>
                        {showProductSelector && (
                            <div className="mb-4">
                                <ProductSelector
                                    filteredProducts={allProducts}
                                    onProductSelect={handleProductSelect}
                                    onAddNewProduct={() => {}}
                                />
                                <button
                                    className="mt-2 text-sm text-gray-500 underline"
                                    onClick={() => setShowProductSelector(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                        <ProductsTable
                            products={order.ProductVariations || []}
                            isAdmin={isAdmin}
                            onRemove={(variationID) => {
                                if (!order) return
                                const idx = order.ProductVariations.findIndex((v) => v.variationID === variationID)
                                if (idx === -1) return
                                const pv = order.ProductVariations[idx]
                                const qty = pv.OrderProduct?.quantityOrdered ?? 1
                                if (qty === 1) {
                                    if (confirm("¿Seguro que quiere eliminar el artículo de la orden de compra?")) {
                                        order.ProductVariations = order.ProductVariations.filter(
                                            (v) => v.variationID !== variationID
                                        )
                                        setForceUpdate((f) => f + 1)
                                    }
                                } else {
                                    const newQty = qty - 1
                                    const price = Number(pv.priceList)
                                    order.ProductVariations[idx] = {
                                        ...pv,
                                        OrderProduct: {
                                            ...pv.OrderProduct,
                                            quantityOrdered: newQty,
                                            subtotal: price * newQty,
                                        },
                                        quantityOrdered: newQty,
                                        subtotal: price * newQty,
                                    }
                                    setForceUpdate((f) => f + 1)
                                }
                            }}
                            onIncrement={(variationID) => {
                                if (!order) return
                                const idx = order.ProductVariations.findIndex((v) => v.variationID === variationID)
                                if (idx === -1) return
                                const pv = order.ProductVariations[idx]
                                const newQty = (pv.OrderProduct?.quantityOrdered ?? 1) + 1
                                const price = Number(pv.priceList)
                                order.ProductVariations[idx] = {
                                    ...pv,
                                    OrderProduct: {
                                        ...pv.OrderProduct,
                                        quantityOrdered: newQty,
                                        subtotal: price * newQty,
                                    },
                                    quantityOrdered: newQty,
                                    subtotal: price * newQty,
                                }
                                setForceUpdate((f) => f + 1)
                            }}
                        />
                    </div>
                    <FinancialSummary neto={neto} iva={iva} totalConIva={totalConIva} />
                    <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                            onClick={handlePrint}
                        >
                            Imprimir
                        </button>

                        {isAdmin && (
                            <button
                                className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={handleActualizarOrden}
                            >
                                Actualizar Orden
                            </button>
                        )}
                        {isAdmin && (
                            <button
                                className=" bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={handleDelete}
                            >
                                Eliminar OC
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
