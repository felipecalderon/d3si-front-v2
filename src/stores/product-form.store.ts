import { create } from "zustand"
import type { CreateProductFormData, ErrorState, Size } from "@/interfaces/products/ICreateProductForm"
import { generateRandomSku } from "@/utils/product-form.utils"

interface ProductFormState {
    products: CreateProductFormData[]
    errors: ErrorState[]
    setProducts: (products: CreateProductFormData[]) => void
    addProduct: () => void
    removeProduct: (productIndex: number) => void
    handleProductChange: (productIndex: number, field: keyof CreateProductFormData, value: string) => void
    addSize: (productIndex: number) => void
    removeSize: (productIndex: number, sizeIndex: number) => void
    handleSizeChange: (productIndex: number, sizeIndex: number, field: keyof Size, value: unknown) => void
    validate: () => void
    resetForm: () => void
}

const getInitialProduct = (): CreateProductFormData => ({
    name: "",
    image: "",
    categoryID: "",
    genre: "Unisex",
    brand: "Otro",
    sizes: [
        {
            sizeNumber: "",
            priceList: 0,
            priceCost: 0,
            sku: generateRandomSku(),
            stockQuantity: 0,
        },
    ],
})

const getInitialErrors = (): ErrorState => ({
    sizes: [{}],
    category: "",
})

export const useProductFormStore = create<ProductFormState>((set, get) => ({
    products: [getInitialProduct()],
    errors: [getInitialErrors()],

    setProducts: (products) => {
        set({ products })
        get().validate()
    },

    addProduct: () => {
        set((state) => ({
            products: [...state.products, getInitialProduct()],
            errors: [...state.errors, getInitialErrors()],
        }))
    },

    removeProduct: (productIndex) => {
        if (get().products.length === 1) return
        set((state) => ({
            products: state.products.filter((_, i) => i !== productIndex),
            errors: state.errors.filter((_, i) => i !== productIndex),
        }))
    },

    handleProductChange: (productIndex, field, value) => {
        set((state) => {
            const newProducts = [...state.products]
            newProducts[productIndex] = { ...newProducts[productIndex], [field]: value }
            return { products: newProducts }
        })
        get().validate()
    },

    addSize: (productIndex) => {
        set((state) => {
            const newProducts = [...state.products]
            const sizes = newProducts[productIndex].sizes
            const basePriceCost = sizes[0]?.priceCost ?? 0
            const basePriceList = sizes[0]?.priceList ?? 0

            newProducts[productIndex] = {
                ...newProducts[productIndex],
                sizes: [
                    {
                        sizeNumber: "",
                        priceCost: basePriceCost,
                        priceList: basePriceList,
                        sku: generateRandomSku(),
                        stockQuantity: 0,
                    },
                    ...sizes,
                ],
            }
            return { products: newProducts }
        })
        get().validate()
    },

    removeSize: (productIndex, sizeIndex) => {
        if (get().products[productIndex].sizes.length === 1) return
        set((state) => {
            const newProducts = [...state.products]
            newProducts[productIndex].sizes.splice(sizeIndex, 1)
            return { products: newProducts }
        })
        get().validate()
    },

    handleSizeChange: (productIndex, sizeIndex, field, value) => {
        set((state) => {
            const newProducts = [...state.products]
            const newSizes = [...newProducts[productIndex].sizes]
            newSizes[sizeIndex] = { ...newSizes[sizeIndex], [field]: value }
            newProducts[productIndex].sizes = newSizes
            return { products: newProducts }
        })
        get().validate()
    },

    validate: () => {
        const { products } = get()
        const newErrors = products.map((product) => {
            const productErrors: ErrorState = {
                sizes: [],
                category: "",
            }
            if (!product.name.trim()) productErrors.name = "Falta llenar este campo"
            if (!product.categoryID.trim()) productErrors.category = "Falta seleccionar una categoría"

            product.sizes.forEach((size) => {
                const sizeErrors: Record<string, string> = {}
                if (!size.priceList) sizeErrors.priceList = "Falta llenar este campo"
                if (!size.priceCost) sizeErrors.priceCost = "Falta llenar este campo"
                if (size.stockQuantity === null || size.stockQuantity === undefined || isNaN(size.stockQuantity)) {
                    sizeErrors.stockQuantity = "Falta llenar este campo"
                }
                productErrors.sizes.push(sizeErrors)
            })

            return productErrors
        })
        set({ errors: newErrors })
    },

    resetForm: () => {
        set({
            products: [getInitialProduct()],
            errors: [getInitialErrors()],
        })
    },
}))
