import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProduct } from "@/interfaces/products/IProduct"

/**
 * Actualiza un producto en la base de datos mediante una petición HTTP PUT.
 * Utiliza la función `fetcher` para manejar la solicitud.
 *
 * @param {IProduct} product - Objeto del producto que se desea actualizar.
 * Debe incluir el `productID` que será usado para identificar el recurso en la URL.
 *
 * @returns {Promise<void>} - No devuelve nada si la operación es exitosa.
 *
 * @throws {Error} - En caso de error, se muestra un mensaje en la consola.
 *
 * @example
 * await updateProduct({
 *   productID: "123",
 *   name: "Zapatilla",
 *   image: "https://...",
 *   totalProducts: 100,
 *   createdAt: "...",
 *   updatedAt: "...",
 *   ProductVariations: [...]
 * });
 */

export const updateProduct = async (product: IProduct): Promise<void> => {
    try {
        await fetcher<void>(`${API_URL}/products/${product.productID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
    } catch (error) {
        console.error("Error updating product", error)
    }
}
