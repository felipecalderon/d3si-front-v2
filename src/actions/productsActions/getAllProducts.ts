import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"

/**
 * Obtiene todos los productos desde la API.
 * Realiza una petición GET a la ruta `/products` y devuelve los datos en formato JSON.
 * 😊
 * TODO: Agregar tipado a la función y al valor retornado.
 */

export const getAllProducts = async () => {
    const products = await fetcher(`${API_URL}/products`)
    return products
}
