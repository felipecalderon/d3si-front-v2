"use client"
import { useSaleStore } from "@/stores/sale.store"
import { IProduct } from "@/interfaces/products/IProduct"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"

interface Props {
    initialProducts: IProduct[]
}

export const ScanInput = ({ initialProducts }: Props) => {
    const { addProduct } = useSaleStore((state) => state.actions)
    const { loading } = useSaleStore()
    const [productCode, setProductCode] = useState("")

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!productCode) return
        addProduct(productCode, initialProducts)
        setProductCode("")
    }

    const results = useMemo(() => {
        const filterProducts = initialProducts.filter((p) => p.name.toLowerCase().includes(productCode))
        return filterProducts
    }, [productCode])

    return (
        <>
            <form onSubmit={handleAdd} className="flex items-center gap-2 mb-6">
                <Input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="Código de producto"
                    className="flex-1"
                    autoFocus
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 font-semibold rounded-lg transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    {loading ? "Buscando..." : "Agregar"}
                </Button>
            </form>
            <div className="relative">
                <ul className="absolute -top-6 bg-white dark:bg-slate-700 border rounded-lg shadow mt-2 max-h-64 overflow-y-auto z-50">
                    {productCode.length > 2 &&
                        productCode !== "" &&
                        results.map((product) =>
                            product.ProductVariations.map((variation) => (
                                <li
                                    key={variation.variationID}
                                    onClick={() => {
                                        addProduct(variation.sku, initialProducts)
                                        setProductCode("")
                                    }}
                                    className="p-2 hover:bg-blue-400 cursor-pointer transition"
                                >
                                    {product.name} - {variation.sizeNumber}
                                </li>
                            ))
                        )}
                </ul>
            </div>
        </>
    )
}
