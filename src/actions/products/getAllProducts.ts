// URL base de la API, definida en variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Obtiene todos los productos desde la API.
 * Realiza una petición GET a la ruta `/products` y devuelve los datos en formato JSON.
 * 😊
 * TODO: Agregar tipado a la función y al valor retornado.
 */

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/products`)
    const products = await response.json()
    return products
}
