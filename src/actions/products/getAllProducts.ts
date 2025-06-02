import { IProduct } from "@/interfaces/products/IProduct"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todos los productos desde la API.
 * Realiza una petición GET a la ruta `/products` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<IProduct[]>} - Promesa que resuelve con un array de objetos `IProduct`.
 * 😊
 * @example
 * const products = await getAllProducts();
 */

export const getAllProducts = async (): Promise<IProduct[]> => {
    const products: IProduct[] = await fetcher(`${API_URL}/products`)
    return products
}
