import { ICategory } from "@/interfaces/categories/ICategory"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todos los productos desde la API.
 * Realiza una petición GET a la ruta `/products` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<ICategory[]>} - Promesa que resuelve con un array de objetos `ICategory`.
 * 😊
 * @example
 * const products = await getAllProducts();
 */

export const getAllCategories = async (): Promise<ICategory[]> => {
    const products: ICategory[] = await fetcher(`${API_URL}/categories`)
    return products
}
