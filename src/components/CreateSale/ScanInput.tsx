"use client"
import { useSaleStore } from "@/stores/sale.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"
import { useTienda } from "@/stores/tienda.store"
import { toast } from "sonner"

interface Props {
    initialProducts: IProduct[]
}

export const ScanInput = ({ initialProducts }: Props) => {
    const { addProduct } = useSaleStore((state) => state.actions)
    const { storeSelected } = useTienda()
    const [productInput, setProductCode] = useState("")

    const parentProductFinded = useMemo(() => {
        const filterProducts = initialProducts.filter((p) => p.name.toLowerCase().includes(productInput))
        return filterProducts
    }, [productInput])

    const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setProductCode(e.target.value)
    }

    const handleEnterPressed = async (e: KeyboardEvent<HTMLInputElement>) => {
        const isEnterPress = e.key === "Enter" || e.key === "NumpadEnter"
        if (isEnterPress) {
            e.preventDefault()
            const productFinded = initialProducts.find((p) => p.ProductVariations.some((v) => v.sku === productInput))
            if (productFinded) {
                const variationFinded = productFinded.ProductVariations.find((v) => v.sku === productInput)
                if (variationFinded) {
                    const variationWithQuantity = { ...variationFinded, quantity: 1 }
                    const storeProduct = variationFinded.StoreProducts?.find(
                        (p) => p.storeID === storeSelected?.storeID && p.variationID === variationFinded.variationID
                    )
                    if (storeProduct) {
                        addProduct(productFinded, variationWithQuantity, storeProduct)
                        setProductCode("")
                    }
                }
            } else {
                toast.error(`No se encontró sku: ${productInput}`)
            }
        }
    }
    return (
        <>
            <form
                className="flex items-center gap-2 mb-6"
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                <Input
                    type="text"
                    value={productInput}
                    onChange={handleSetInputValue}
                    onKeyDown={handleEnterPressed}
                    placeholder="Código de producto"
                    className="flex-1"
                    autoFocus
                />
            </form>
            <div className="relative">
                <ul className="absolute -top-6 bg-white dark:bg-slate-700 border rounded-lg shadow mt-2 max-h-64 overflow-y-auto z-50">
                    {productInput.length > 2 &&
                        productInput !== "" &&
                        parentProductFinded.map((product) =>
                            product.ProductVariations.map((variation) => {
                                const storeID = storeSelected?.storeID ?? ""
                                const storeProduct = variation.StoreProducts?.find(
                                    (p) => p.storeID === storeID && p.variationID === variation.variationID
                                )
                                if (!storeProduct) return null
                                const variationWithQuantity: IVariationWithQuantity = { ...variation, quantity: 1 }
                                return (
                                    <li
                                        key={variation.variationID}
                                        onClick={() => {
                                            addProduct(product, variationWithQuantity, storeProduct)
                                            setProductCode("")
                                        }}
                                        className="p-2 hover:bg-blue-400 cursor-pointer transition"
                                    >
                                        {product.name} - {variation.sizeNumber}
                                    </li>
                                )
                            })
                        )}
                </ul>
            </div>
        </>
    )
}
