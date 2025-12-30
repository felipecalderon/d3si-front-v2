"use client"
import { useSaleStore } from "@/stores/sale.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { Input } from "@/components/ui/input"
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"
import { useTienda } from "@/stores/tienda.store"
import { toast } from "sonner"

interface Props {
    initialProducts: IProduct[]
}

export const ScanInput = ({ initialProducts }: Props) => {
    const { addProduct, updateQuantity } = useSaleStore((state) => state.actions)
    const { storeSelected } = useTienda()
    const [productInput, setProductCode] = useState("")

    const parentProductFinded = useMemo(() => {
        const inputTokens = productInput.toLowerCase().trim().split(/\s+/)

        return initialProducts.filter((p) => {
            const nameTokens = p.name.toLowerCase().split(/\s+/)

            return inputTokens.every((inputToken) => nameTokens.some((nameToken) => nameToken.includes(inputToken)))
        })
    }, [productInput, initialProducts])

    const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setProductCode(e.target.value)
    }

    const handleEnterPressed = async (e: KeyboardEvent<HTMLInputElement>) => {
        const isEnterPress = e.key === "Enter" || e.key === "NumpadEnter"
        if (isEnterPress) {
            e.preventDefault()
            const productFinded = initialProducts.find((p) =>
                p.ProductVariations.some((v) => v.sku === productInput.trim())
            )
            if (productFinded) {
                const variationFinded = productFinded.ProductVariations.find((v) => v.sku === productInput.trim())
                if (variationFinded) {
                    const variationWithQuantity = { ...variationFinded, quantity: 1 }
                    const storeProduct = variationFinded.StoreProducts?.find(
                        (p) => p.storeID === storeSelected?.storeID && p.variationID === variationFinded.variationID
                    )
                    if (storeProduct) {
                        addProduct(productFinded, variationWithQuantity, storeProduct)
                        setProductCode("")
                    } else {
                        const storeProduct: IStoreProduct = {
                            createdAt: variationFinded.createdAt,
                            priceCostStore: variationFinded.priceCost.toString(),
                            quantity: 0,
                            Store: storeSelected!,
                            storeID: storeSelected!.storeID,
                            storeProductID: "",
                            updatedAt: variationFinded.updatedAt,
                            variationID: variationFinded.variationID,
                        }
                        addProduct(productFinded, { ...variationWithQuantity, quantity: 0 }, storeProduct)
                        // updateQuantity(variationFinded.sku, 0)
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
                                let storeProduct: IStoreProduct = {
                                    createdAt: variation.createdAt,
                                    priceCostStore: variation.priceCost.toString(),
                                    quantity: 0,
                                    Store: storeSelected!,
                                    storeID: storeSelected!.storeID,
                                    storeProductID: "",
                                    updatedAt: variation.updatedAt,
                                    variationID: variation.variationID,
                                }
                                const storeProductf = variation.StoreProducts?.find(
                                    (p) =>
                                        p.storeID === storeSelected!.storeID && p.variationID === variation.variationID
                                )
                                if (storeProductf) {
                                    console.log(storeProductf)
                                    storeProduct = storeProductf
                                }
                                const variationWithQuantity: IVariationWithQuantity = { ...variation, quantity: 1 }
                                return (
                                    <li
                                        key={variation.variationID}
                                        onClick={() => {
                                            addProduct(product, variationWithQuantity, storeProduct)
                                            setProductCode("")
                                            if (storeProduct.quantity === 0) {
                                                updateQuantity(variation.sku, 0)
                                            }
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
