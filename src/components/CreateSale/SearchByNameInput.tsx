import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useTienda } from "@/stores/tienda.store"
import { FlattenedProduct } from "@/interfaces/products/IFlatternProduct"
import { toast } from "sonner"
import { searchProducts } from "@/utils/searchProducts"

interface Props {
    onProductoSeleccionado: (producto: FlattenedProduct) => void
}

export const SearchByNameInput = ({ onProductoSeleccionado }: Props) => {
    const { storeSelected } = useTienda()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<FlattenedProduct[]>([])
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!storeSelected || query.length === 0) {
                setResults([])
                return
            }

            handleSearch()
        }, 300)

        return () => clearTimeout(timeout)
    }, [query, storeSelected])

    const handleSearch = async () => {
        try {
            setIsSearching(true)
            await searchProducts({
                query,
                onProductoSeleccionado,
                onResults: setResults,
            })
        } catch (error) {
            console.error("Error al buscar productos:", error)
            toast.error(error instanceof Error ? error.message : "Error al buscar productos")
        } finally {
            setIsSearching(false)
        }
    }

    const handleClick = (product: FlattenedProduct) => {
        toast(`¿Agregar "${product.name}" al carrito?`, {
            action: {
                label: "Sí, agregar",
                onClick: () => {
                    onProductoSeleccionado(product)
                    setQuery("")
                    setResults([])
                },
            },
            cancel: {
                label: "Cancelar",
                onClick: () => {}, 
            },
            duration: 8000,
        })
    }

    if (!storeSelected) {
        return <p className="text-red-500 text-sm">Seleccioná una tienda para buscar productos</p>
    }

    return (
        <div className="w-full">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto por nombre"
                className="mb-2"
            />

            {isSearching && <p className="text-sm text-gray-500">Buscando...</p>}

            {results.length > 0 && (
                <ul className="bg-black border rounded-lg shadow mt-2 max-h-64 overflow-y-auto">
                    {results.map((product) => (
                        <li
                            key={product.id}
                            onClick={() => handleClick(product)}
                            className="p-2 hover:bg-blue-400 cursor-pointer transition"
                        >
                            {product.name} - Talle {product.size}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
