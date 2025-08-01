import { IOrder } from "@/interfaces/orders/IOrder"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todas las órdenes desde la API.
 * Realiza una petición GET a la ruta `/order` y devuelve los datos como un arreglo de órdenes.
 *
 * @returns {Promise<IOrder[]>} - Promesa que resuelve con un array de objetos `IOrder`.
 * @example
 * const orders = await getAllOrders();
 */

export const getAllOrders = async (): Promise<IOrder[]> => {
    const orders: IOrder[] = await fetcher(`${API_URL}/order`)
    return orders
}
