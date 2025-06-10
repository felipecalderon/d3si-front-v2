"use server"

import { revalidatePath } from "next/cache"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"

//Esta funcion actualmente no usa fetcher porque fetcher arroja error si !res.ok y
//  el backend por ahora manda un falso 404, entonces en lo que se arregla se usa fetch

export const createMassiveProducts = async (formData: CreateProductFormData) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/crear-masivo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ products: [formData] }),
        })

        // Si responde 404, pero el producto se guarda, consideramos éxito
        if (res.status === 404) {
            revalidatePath("/inventory")
            return { success: true }
        }

        if (!res.ok) {
            // Cualquier otro error distinto a 404 se trata como fallo
            return {
                success: false,
                error: `Error del servidor: ${res.status} ${res.statusText}`,
            }
        }

        revalidatePath("/inventory")
        return { success: true }
    } catch (err) {
        console.error("Error al crear producto:", err)
        return {
            success: false,
            error: "No se pudo crear el producto. Verifica los datos o intenta más tarde.",
        }
    }
}
