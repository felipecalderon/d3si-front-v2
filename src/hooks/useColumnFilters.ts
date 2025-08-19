import { useMemo } from "react"

interface Filters {
  producto: string
  marca: string
  categoria: string
  talla: string
  precioCosto: string
  precioPlaza: string
  ofertas: boolean
  stock: string
  stockAgregado: string
}

export function useColumnFilters(products: any[], variations: any[], filters: Filters, adminStoreIDs: string[]) {
  // FILTRO DE PRODUCTOS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // PRODUCTO filter (name, sku, genre)
      if (filters.producto.trim()) {
        const searchTerm = filters.producto.toLowerCase()
        const nameMatch = product.name.toLowerCase().includes(searchTerm)
        const skuMatch = product.ProductVariations.some((v: any) => v.sku === searchTerm)
        const genreMatch = product.genre?.toLowerCase().includes(searchTerm)

        if (!(nameMatch || skuMatch || genreMatch)) return false
      }

      // MARCA filter
      if (filters.marca.trim()) {
        const brandMatch = product.brand?.toLowerCase().includes(filters.marca.toLowerCase())
        if (!brandMatch) return false
      }

      // CATEGORÍA filter
      if (filters.categoria.trim()) {
        const categoryName = product.Category?.name?.toLowerCase() || ""
        if (!categoryName.includes(filters.categoria.toLowerCase())) return false
      }

      return true
    })
  }, [products, filters])

  // FILTRO DE VARIACIONES
  const filteredVariations = useMemo(() => {
    return variations.filter(({ variation }) => {
      // TALLA filter
      if (filters.talla.trim()) {
        const sizeMatch = variation.sizeNumber?.toLowerCase().includes(filters.talla.toLowerCase())
        if (!sizeMatch) return false
      }

      // PRECIO COSTO filter - exacta
      if (filters.precioCosto.trim()) {
        const filterValue = parseInt(filters.precioCosto)
        if (!isNaN(filterValue) && variation.priceCost !== filterValue) return false
      }

      // PRECIO PLAZA filter - exacta
      if (filters.precioPlaza.trim()) {
        const filterValue = parseInt(filters.precioPlaza)
        if (!isNaN(filterValue) && variation.priceList !== filterValue) return false
      }

      // OFERTAS filter
      if (filters.ofertas) {
        if (!variation.offerPrice || variation.offerPrice <= 0) return false
      }

      // STOCK filter - exacta
      if (filters.stock.trim()) {
        const filterValue = parseInt(filters.stock)
        if (!isNaN(filterValue) && variation.stockQuantity !== filterValue) return false
      }

      // STOCK AGREGADO filter - exacta
      if (filters.stockAgregado.trim()) {
        const stockAgregado =
          variation.StoreProducts?.filter((sp: any) => !adminStoreIDs.includes(sp.storeID)).reduce(
            (sum: number, sp: any) => sum + sp.quantity,
            0
          ) ?? 0

        const filterValue = parseInt(filters.stockAgregado)
        if (!isNaN(filterValue) && stockAgregado !== filterValue) return false
      }

      return true
    })
  }, [variations, filters, adminStoreIDs])

  return { filteredProducts, filteredVariations }
}
