import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Función asíncrona que obtiene todos los productos desde la base de datos.
 * Realiza una petición GET a la ruta `/products` de la API.
 * Retorna un arreglo con los productos en formato JSON.
 *
 * TODO: Agregar tipado a la función.
 */

export const getProductByStoreId = async (id: string) => {
    const storeProduct = await fetcher(`${API_URL}/products?storeId=${id}`)
    return storeProduct
}
