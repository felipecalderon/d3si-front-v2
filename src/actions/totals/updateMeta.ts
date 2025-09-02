import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

/**
 * Actualiza un IUser en la base de datos mediante una petición HTTP PUT.
 * Utiliza la función `fetcher` para manejar la solicitud.
 *
 * Debe incluir el `productID` que será usado para identificar el recurso en la URL.
 *
 * @returns {Promise<void>} - No devuelve nada si la operación es exitosa.
 *
 * @throws {Error} - En caso de error, se muestra un mensaje en la consola.
 *
 * @example
 * await updateUser = {
    UserID: string,
    storeID: string
}
 */

export async function updateMeta(fecha: string, monto: number): Promise<boolean> {
    const store = await fetcher<boolean>(`${API_URL}/home`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha: fecha, monto: monto }),
    })
    return store
}
