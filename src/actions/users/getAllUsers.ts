import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IUser } from "@/interfaces/users/IUser"

/**
 * Obtiene todos los usuarios desde la API.
 * Realiza una petición GET a la ruta `/users` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<IUser[]>} - Promesa que resuelve con un array de objetos `IUser`.
 * 😊
 * @example
 * const users = await getAllusers();
 */

export const getAllUsers = async (): Promise<IUser[]> => {
    const users: IUser[] = await fetcher(`${API_URL}/users`)
    return users
}
