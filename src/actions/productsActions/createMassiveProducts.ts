import { API_URL } from "@/lib/enviroments"
import { ProductAPI } from "@/types/products"
import { CreateMassiveProductPayload } from "@/types/products"

/**
 * Crea productos masivamente en la API.
 * Envía un array de productos al endpoint `/products/crear-masivo` con método POST.
 * @param payload Datos para crear los productos.
 * @returns Los productos creados o la respuesta del backend.
 */
export const createMassiveProducts = async (payload: CreateMassiveProductPayload): Promise<ProductAPI[]> => {
    const response = await fetch(`${API_URL}/products/crear-masivo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Error creando productos: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data as ProductAPI[]
}
