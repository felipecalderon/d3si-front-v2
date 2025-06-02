/**
 * Función utilitaria para realizar peticiones HTTP con `fetch`. 
 * Envuelve la función fetch nativa y lanza un error si la respuesta no es exitosa.
 *
 * @template T - Tipo de dato esperado en la respuesta (por ejemplo, un objeto, un array, etc.).
 * @param {string} url - URL a la que se realizará la petición.
 * @param {RequestInit} [options={}] - Opcional. Configuración para la petición (método, headers, body, etc.).
 * @returns {Promise<T>} - Promesa que resuelve con los datos de la respuesta parseados como JSON.
 * @throws {Error} - Lanza un error si la respuesta del servidor no es exitosa (`response.ok` es false).
 *
 * @example
 * const user = await fetcher<User>(`${API_URL}/users/123`); 
 */

export const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}
