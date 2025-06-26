import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Elimina una orden por su ID.
 * Realiza una petición DELETE a la ruta `/order?orderID={orderID}`.
 *
 * @param {string} orderID - El ID de la orden a eliminar.
 * @returns {Promise<void>} - Promesa que resuelve cuando la orden ha sido eliminada.
 * @example
 * await deleteOrder("5ba51990-6fbb-46ca-bb43-fd439c8f4048");
 */
export const deleteOrder = async (orderID: string): Promise<void> => {
    await fetcher(`${API_URL}/order?orderID=${orderID}`, {
        method: "DELETE",
    })
}
