import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { ICategory } from "@/interfaces/categories/ICategory"

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
 * await updateSubCategoria = {
    name: string,
    categoriaID: string
}
 */

export async function updateCategory(category: ICategory) {
    const store = await fetcher(`${API_URL}/categories/${category.categoryID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: category.name }),
    })
    return store
}
