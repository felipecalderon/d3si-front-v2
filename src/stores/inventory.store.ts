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
    columnFilters: any
    setSearch: (search: string) => void
    setIsLoading: (loading: boolean) => void
    setRawProducts: (products: IProduct[]) => void
    setAddSizeModalProductID: (id: string | null) => void
    setEditingField: (field: EditingField | null) => void
    setEditValue: (value: string) => void
    setCurrentPage: (page: number) => void
    setColumnFilters: (filters: any) => void
    handleFilterChange: (field: string, value: string | boolean) => void
    clearColumnFilters: () => void
}

export const inventoryStore = create<InventoryContextWrapper>((set) => ({
    search: "",
    isLoading: false,
    addSizeModalProductID: null,
    rawProducts: [],
    editingField: null,
    editValue: "",
    currentPage: 0,
    columnFilters: {
        producto: "",
        marca: "",
        categoria: "",
        talla: "",
        precioCosto: "",
        precioPlaza: "",
        ofertas: false,
        stock: "",
        stockAgregado: "",
    },
    setSearch: (search) => {
        set({ search })
    },
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setRawProducts: (products: IProduct[]) => set({ rawProducts: products }),
    setAddSizeModalProductID: (id) => set({ addSizeModalProductID: id }),
    setEditingField: (field) => set({ editingField: field }),
    setEditValue: (value) => set({ editValue: value }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setColumnFilters: (filters) => set({ columnFilters: filters }),
    handleFilterChange: (field, value) => {
        set((state) => ({
            columnFilters: {
                ...state.columnFilters,
                [field]: value,
            },
        }));
    },
    clearColumnFilters: () => {
        set({
            columnFilters: {
                producto: "",
                marca: "",
                categoria: "",
                talla: "",
                precioCosto: "",
                precioPlaza: "",
                ofertas: false,
                stock: "",
                stockAgregado: "",
            },
        });
    },
}));
