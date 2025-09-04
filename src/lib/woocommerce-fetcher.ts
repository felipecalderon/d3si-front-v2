import { WOO_KEY, WOO_SECRET, WOO_URL } from "./enviroments"

/**
 * Función utilitaria para realizar peticiones a la API de WooCommerce usando query params.
 *
 * @template T - Tipo de dato esperado en la respuesta.
 * @param {string} endpoint - El endpoint de la API de WooCommerce (ej. 'orders').
 * @param {RequestInit} [options={}] - Opcional. Configuración para la petición.
 * @returns {Promise<T>} - Promesa que resuelve con los datos de la respuesta.
 * @throws {Error} - Lanza un error si la respuesta no es exitosa.
 */
export const wooFetcher = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    if (!WOO_URL || !WOO_KEY || !WOO_SECRET) {
        throw new Error("Las credenciales o la URL de WooCommerce no están definidas.")
    }

    // Construir la URL y agregar los parámetros de autenticación de forma segura.
    // Esto evita problemas si el endpoint ya contiene parámetros de consulta.
    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`)
    url.searchParams.append("consumer_key", WOO_KEY)
    url.searchParams.append("consumer_secret", WOO_SECRET)

    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        cache: "no-store",
        next: { revalidate: 0 },
    })

    if (!response.ok) {
        const error = await response.json()
        // console.log(error)
        throw new Error(error.message || "Error en la petición a WooCommerce")
    }

    const data = await response.json()
    return data
}
