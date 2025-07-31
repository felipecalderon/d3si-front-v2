import { FlattenedProduct } from "@/interfaces/products/IFlatternProduct"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { flattenProducts } from "@/utils/flattenProducts"

interface SearchParams {
    query: string
    onProductoSeleccionado: (producto: FlattenedProduct) => void
    onResults: (productos: FlattenedProduct[]) => void
}

export const searchProducts = async ({ query, onProductoSeleccionado, onResults }: SearchParams) => {
    const isOnlyNumbers = /^\d+$/.test(query)
    const rawProducts = await getAllProducts()
    const allProducts = flattenProducts(rawProducts)

    if (isOnlyNumbers) {
        const product = allProducts.find((p) => p.sku === query)
        if (product) {
            const confirmed = window.confirm(`¿Agregar "${product.name}" al carrito?`)
            if (confirmed) {
                onProductoSeleccionado(product)
                onResults([])
            }
        } else {
            throw new Error("Producto no encontrado por código")
        }
    } else {
        const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        onResults(filtered)
    }
}
