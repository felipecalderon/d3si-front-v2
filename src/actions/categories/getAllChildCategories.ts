import { ICategory } from "@/interfaces/categories/ICategory"
import { IChildCategory } from "@/interfaces/categories/ICategory"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

export const getAllChildCategories = async (): Promise<IChildCategory[]> => {
    // ✅ Aquí se tipa correctamente como ICategory[]
    const allCategories = await fetcher<ICategory[]>(`${API_URL}/categories`)

    const subcategories: IChildCategory[] = allCategories.flatMap((category) =>
        (category.subcategories || []).map((sub) => ({
            name: sub.name ?? "",
            categoryID: sub.categoryID ?? "",
            parentID: sub.parentID ?? "",
            createdAt: sub.createdAt ?? "",
            updatedAt: sub.updatedAt ?? "",
        }))
    )

    return subcategories
}
