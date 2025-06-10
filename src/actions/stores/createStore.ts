import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IStore } from "@/interfaces/stores/IStore"

/**
 * Obtiene todos los usuarios desde la API.
 * Realiza una petición GET a la ruta `/store` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<IStore[]>} - Promesa que resuelve con un array de objetos `IStore`.
 * 😊
 * @example
 * const store = await createStore();
 */
export async function createStore(name: string, userID: string, location: string, rut: string, phone: string, address: string,  city: string, isAdminStore: boolean) {
    const store: IStore[] = await fetcher(`${API_URL}/store`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userID, location, rut, phone, address, city, isAdminStore }),
    })
    return store
}
