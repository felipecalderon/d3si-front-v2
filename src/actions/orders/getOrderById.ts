import { ISingleOrderResponse } from "@/interfaces/orders/IOrder"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene una orden por su ID desde la API.
 * Realiza una petición GET a la ruta `/order/{id}` y devuelve el objeto de la orden.
 *
 * @param {string} orderId - El ID de la orden a buscar.
 * @returns {Promise<ISingleOrderResponse>} - Promesa que resuelve con el objeto de la orden.
 * @example
 * const order = await getOrderById("123");
 */

export const getOrderById = async (orderId: string): Promise<ISingleOrderResponse> => {
    const order: ISingleOrderResponse = await fetcher(`${API_URL}/order/${orderId}`)
    return order
}
