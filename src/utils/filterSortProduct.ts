import { FilterType, SortDirection } from "@/components/ListTable/ListFilters"
import { IProduct } from "@/interfaces/products/IProduct"

export const applyFiltersAndSort = (
    products: IProduct[],
    selectedFilter: FilterType,
    sortDirection: SortDirection,
    selectedGenre?: string
): IProduct[] => {
    let filtered = [...products]

    if (selectedGenre) {
        filtered = filtered.filter((product) => product && product.genre === selectedGenre)
    }

    return filtered.sort((a, b) => {
        let comparison = 0
        switch (selectedFilter) {
            case "genre":
                const genreA = (a && a.genre) || ""
                const genreB = (b && b.genre) || ""
                comparison = genreA.localeCompare(genreB)
                break
            case "cost":
                const avgCostA =
                    a?.ProductVariations?.reduce((sum, v) => sum + (v?.priceCost ?? 0), 0) /
                        (a.ProductVariations.length || 1) || 0
                const avgCostB =
                    b?.ProductVariations?.reduce((sum, v) => sum + (v?.priceCost ?? 0), 0) /
                        (b.ProductVariations.length || 1) || 0
                comparison = avgCostA - avgCostB
                break
            case "quantity":
                const totalStockA = a?.ProductVariations?.reduce((sum, v) => sum + (v?.stockQuantity ?? 0), 0) || 0
                const totalStockB = b?.ProductVariations?.reduce((sum, v) => sum + (v?.stockQuantity ?? 0), 0) || 0
                comparison = totalStockA - totalStockB
                break
            case "created":
                const createdA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
                const createdB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
                comparison = createdA - createdB
                break
            case "updated":
                const updatedA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0
                const updatedB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0
                comparison = updatedA - updatedB
                break
        }
        return sortDirection === "asc" ? comparison : -comparison
    })
}
