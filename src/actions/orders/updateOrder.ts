import { IOrder } from "@/interfaces/orders/IOrder"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Actualiza una orden existente en la API.
 * Realiza una petición PUT a la ruta `/order` con los datos de la orden.
 *
 * @param {Partial<IOrder>} orderData - Objeto con los campos a actualizar de la orden.
 * @returns {Promise<IOrder>} - Promesa que resuelve con el objeto `IOrder` actualizado.
 * @example
 * const updated = await updateOrder({ orderID, status: "Pagado" });
 */
export const updateOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
    const response: IOrder = await fetcher(`${API_URL}/order`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
    return response
}
