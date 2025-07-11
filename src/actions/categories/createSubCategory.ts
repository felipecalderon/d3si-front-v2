import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { ICategory } from "@/interfaces/categories/ICategory"

/**
 * crea una categoria padre si solo pasa el nombre, y crea una categoria si pasa el nombre y el parentID
 * Realiza una petición POST a la ruta `/Category` y devuelve los datos como un arreglo de productos.
 *
 * @returns {Promise<ICategory[]>} - Promesa que resuelve con un array de objetos `ICategory`.
 * 😊
 * @example
 * const Category = await createCategory();
 */
export async function createSubategory(categoryFatherID: string, categoyName: string) {
    const category: ICategory[] = await fetcher(`${API_URL}/categories/`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: categoyName, parentID:  categoryFatherID }),
    })
    return category
}
