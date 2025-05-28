// URL base de la API, definida en variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Función asíncrona que obtiene todos los productos desde la base de datos.
 * Realiza una petición GET a la ruta `/products` de la API.
 * Retorna un arreglo con los productos en formato JSON.
 * 
 * TODO: Agregar tipado a la función.
 */

export const getProductByStoreId = async (id: string) => {
    const response = await fetch(`${API_URL}/products?storeId=${id}`)
    const storeProduct = await response.json()
    return storeProduct
}
