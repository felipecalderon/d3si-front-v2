import { ICategory } from "@/interfaces/categories/ICategory"
import { create } from "zustand"

interface CategoriesStore {
    categories: ICategory[]
    setCategories: (categories: ICategory[]) => void
}

export const useCategories = create<CategoriesStore>((set, get) => ({
    categories: [],
    setCategories: (cats) => {
        set({ categories: cats })
    },
}))
