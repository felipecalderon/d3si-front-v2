import { create } from "zustand"
import { ICategory } from "@/interfaces/categories/ICategory"
import { getAllCategories } from "@/actions/categories/getAllCategories"

interface CategoriesStore {
    categories: ICategory[]
    loading: boolean
    fetchCategories: () => Promise<void>
    setCategories: (categories: ICategory[]) => void
}

export const useCategories = create<CategoriesStore>((set) => ({
    categories: [],
    loading: false,
    setCategories: (categories) => set({ categories }),
    fetchCategories: async () => {
        try {
            set({ loading: true })
            const categories = await getAllCategories()
            set({ categories })
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            set({ loading: false })
        }
    },
}))
