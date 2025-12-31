"use client"
import { useEffect, useMemo, useState } from "react"
import { ScanInput } from "@/components/CreateSale/ScanInput"
import { CartTable } from "@/components/CreateSale/CartTable"
import { useSaleStore } from "@/stores/sale.store"
import { ISaleRequest, PaymentType } from "@/interfaces/sales/ISale"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { IProduct } from "@/interfaces/products/IProduct"
import { toPrice } from "@/utils/priceFormat"
import { Button } from "../ui/button"
import { useTienda } from "@/stores/tienda.store"
import { createNewSale } from "@/actions/sales/postSale"
import { toast } from "sonner"

export const SaleForm = ({ initialProducts }: { initialProducts: IProduct[] }) => {
    const router = useRouter()
    const { cartItems, paymentMethod, actions } = useSaleStore()
    const { setPaymentMethod, clearCart } = actions
    const { storeSelected } = useTienda()
    const [loading, setLoading] = useState(false)

    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            return acc + item.variation.quantity * item.variation.priceList
        }, 0)
    }, [cartItems])

    const handleSubmit = async () => {
        try {
            const hasEmptyProducts = cartItems.filter((item) => item.variation.quantity === 0)
            if (hasEmptyProducts.length > 0) {
                return toast.error("Por favor elimina los productos sin stock")
            }
            setLoading(true)
            if (!storeSelected) return toast.error("No hay una tienda elegida")
            const toSubmitSale: ISaleRequest = {
                paymentType: paymentMethod,
                status: "Pagado",
                storeID: storeSelected.storeID,
                SaleProducts: cartItems.map((item) => ({
                    storeProductID: item.storeProduct.storeProductID,
                    quantitySold: item.variation.quantity,
                    unitPrice: item.variation.priceList,
                })),
            }

            const res = await createNewSale(toSubmitSale)
            if (res) {
                toast.success("Venta generada exitosamente! Redirigiendo...")
                actions.clearCart()
                router.refresh()
                router.push(`/home?storeID=${storeSelected?.storeID}`)
            }
        } catch (error) {
            toast.error("Falló al crear la venta :(")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            clearCart()
        }
    }, [clearCart])

    return (
        <>
            <ScanInput initialProducts={initialProducts} />

            <CartTable />
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col md:flex-row items-center justify-between md:justify-end gap-4 md:gap-8">
                    <p className="text-xl font-semibold dark:text-white text-gray-800">Total: ${toPrice(total)}</p>
                    <div className="flex md:flex-row flex-col items-center gap-2">
                        <label
                            htmlFor="pago"
                            className="dark:text-slate-300 text-gray-700 font-medium whitespace-nowrap flex-shrink-0"
                        >
                            Tipo de pago:
                        </label>
                        <Select value={paymentMethod} onValueChange={(value: PaymentType) => setPaymentMethod(value)}>
                            <SelectTrigger className="p-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Seleccionar tipo de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Efectivo">Efectivo</SelectItem>
                                <SelectItem value="Debito">Débito</SelectItem>
                                <SelectItem value="Credito">Crédito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        disabled={loading || cartItems.length === 0}
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        {loading ? "Procesando..." : "Vender"}
                    </Button>
                </div>
            </div>
        </>
    )
}
