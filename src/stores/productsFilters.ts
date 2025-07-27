import { FilterType, SortDirection } from "@/components/ListTable/ListFilters"
import { IProduct } from "@/interfaces/products/IProduct"
import { applyFiltersAndSort } from "@/utils/filterSortProduct"
import { create } from "zustand"
import { inventoryStore } from "./inventory.store"

interface ProductsFilterStore {
    filteredAndSortedProducts: IProduct[]
    selectedFilter: FilterType
    sortDirection: SortDirection
    selectedGenre?: string
    setSelectedFilter: (selectedFilter: FilterType) => void
    setSortDirection: (sortDirection: SortDirection) => void
    setSelectedGenre: (selectedGenre?: string) => void
    clearFilters: () => void
}

export const useProductFilter = create<ProductsFilterStore>((set) => ({
    filteredAndSortedProducts: inventoryStore.getState().rawProducts,
    selectedFilter: "genre",
    sortDirection: "desc",
    selectedGenre: undefined,

    setSelectedFilter: (selectedFilter) =>
        set((state) => ({
            selectedFilter,
            filteredAndSortedProducts: applyFiltersAndSort(
                inventoryStore.getState().rawProducts,
                selectedFilter, // <-- nuevo valor
                state.sortDirection,
                state.selectedGenre
            ),
        })),

    setSortDirection: (sortDirection) =>
        set((state) => ({
            sortDirection,
            filteredAndSortedProducts: applyFiltersAndSort(
                inventoryStore.getState().rawProducts,
                state.selectedFilter,
                sortDirection, // <-- nuevo valor
                state.selectedGenre
            ),
        })),

    setSelectedGenre: (selectedGenre) =>
        set((state) => ({
            selectedGenre,
            filteredAndSortedProducts: applyFiltersAndSort(
                inventoryStore.getState().rawProducts,
                state.selectedFilter,
                state.sortDirection,
                selectedGenre // <-- nuevo valor
            ),
        })),

    clearFilters: () =>
        set(() => {
            const defaultState = {
                selectedFilter: "genre" as FilterType,
                sortDirection: "desc" as SortDirection,
                selectedGenre: undefined,
            }
            return {
                ...defaultState,
                filteredAndSortedProducts: applyFiltersAndSort(
                    inventoryStore.getState().rawProducts,
                    defaultState.selectedFilter,
                    defaultState.sortDirection,
                    defaultState.selectedGenre
                ),
            }
        }),
}))
