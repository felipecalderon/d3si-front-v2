import { IProduct } from "@/interfaces/products/IProduct"
import { create } from "zustand"

export interface EditingField {
    sku: string
    field: "priceCost" | "priceList" | "stockQuantity" | "sizeNumber" | "name" | "brand"
}
interface InventoryContextWrapper {
    search: string
    isLoading: boolean
    rawProducts: IProduct[]
    addSizeModalProductID: string | null
    editingField: EditingField | null
    editValue: string
    currentPage: number
    setSearch: (search: string) => void
    setIsLoading: (loading: boolean) => void
    setRawProducts: (products: IProduct[]) => void
    setAddSizeModalProductID: (id: string | null) => void
    setEditingField: (field: EditingField | null) => void
    setEditValue: (value: string) => void
    setCurrentPage: (page: number) => void
}

export const inventoryStore = create<InventoryContextWrapper>((set) => ({
    search: "",
    isLoading: false,
    addSizeModalProductID: null,
    rawProducts: [],
    editingField: null,
    editValue: "",
    currentPage: 0,
    setSearch: (search) => {
        set({ search })
    },
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setRawProducts: (products: IProduct[]) => set({ rawProducts: products }),
    setAddSizeModalProductID: (id) => set({ addSizeModalProductID: id }),
    setEditingField: (field) => set({ editingField: field }),
    setEditValue: (value) => set({ editValue: value }),
    setCurrentPage: (page) => set({ currentPage: page }),
}))
