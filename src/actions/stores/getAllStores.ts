import { IStore } from "@/interfaces/stores/IStore"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todos los productos desde la API.
 * Realiza una petición GET a la ruta `/stores` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<IStore[]>} - Promesa que resuelve con un array de objetos `IStore`.
 * 😊
 * @example
 * const stores = await getAllStores();
 */

export const getAllStores = async (): Promise<IStore[]> => {
    const stores: IStore[] = await fetcher(`${API_URL}/store`)
    return stores
}