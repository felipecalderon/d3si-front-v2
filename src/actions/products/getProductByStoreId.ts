import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IStoreProduct } from "@/interfaces/IStoreProduct"

/**
 * Obtiene todos los productos asociados a una tienda específica desde la base de datos.
 * Realiza una petición GET a la API usando el ID de la tienda como query parameter.
 *
 * @param {string} id - ID de la tienda (`storeId`) para filtrar los productos.
 * @returns {Promise<IStoreProduct[]>} - Promesa que resuelve con un arreglo de productos de la tienda.
 *
 * @example
 * const products = await getProductByStoreId("7741f0f0-e0db-43ad-83bc-1ce9e70b76aa");
 */

export const getProductByStoreId = async (id: string): Promise<IStoreProduct[]> => {
    const storeProduct: IStoreProduct[] = await fetcher(`${API_URL}/products?storeId=${id}`)
    return storeProduct
}
