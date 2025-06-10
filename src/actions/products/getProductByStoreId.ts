import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import { IProduct } from "@/interfaces/products/IProduct"

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

export const getProductByStoreId = async (id: string): Promise<IProduct[]> => {
    const storeProduct: IProduct[] = await fetcher(`${API_URL}/store?storeID=${id}`)
    return storeProduct
}
