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

export async function updateStore(storeID: string ,name: string, location: string, city: string, address: string, phone: string, role: string, email: string, isAdminStore: boolean) {
    const store = await fetcher(`${API_URL}/store/${storeID}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, location, city, address, phone, role, email, isAdminStore }),
    })
    return store
}
