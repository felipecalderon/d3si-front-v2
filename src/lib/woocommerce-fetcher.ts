import { WOO_KEY, WOO_SECRET, WOO_URL } from "./enviroments"

/**
 * Crea la cabecera de autenticación Basic para la API de WooCommerce.
 * @returns {string} Las credenciales codificadas en Base64.
 */
const createAuthHeader = (): string => {
    if (!WOO_KEY || !WOO_SECRET) {
        throw new Error("La Key o el Secret de la API de WooCommerce no están definidos.")
    }
    // El objeto Buffer está disponible globalmente en el entorno de Node.js (Server Components)
    const buffer = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`)
    console.log({ WOO_KEY, WOO_SECRET, base64: buffer.toString("base64") })
    return `Basic ${buffer.toString("base64")}`
}

/**
 * Función utilitaria para realizar peticiones a la API de WooCommerce usando Basic Auth.
 *
 * @template T - Tipo de dato esperado en la respuesta.
 * @param {string} endpoint - El endpoint de la API de WooCommerce (ej. 'orders').
 * @param {RequestInit} [options={}] - Opcional. Configuración para la petición.
 * @returns {Promise<T>} - Promesa que resuelve con los datos de la respuesta.
 * @throws {Error} - Lanza un error si la respuesta no es exitosa.
 */
export const wooFetcher = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${WOO_URL}/wp-json/wc/v3/${endpoint}`
    const authHeader = createAuthHeader()

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
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
