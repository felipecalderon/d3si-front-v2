import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { ICategory } from "@/interfaces/categories/ICategory"

/**
 * Obtiene todos los categories asociados a una tienda específica desde la base de datos.
 * Realiza una petición GET a la API usando el ID de la tienda como query parameter.
 *
 * @param {string} id - ID de la tienda (`ID`) para filtrar los categories.
 */

export const getCategoryByID = async (id: string): Promise<ICategory[]> => {
    const Category: ICategory[] = await fetcher(`${API_URL}/categories/${id}`)
    return Category
}
