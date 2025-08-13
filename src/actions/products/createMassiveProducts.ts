"use server"

import { revalidatePath } from "next/cache"
import { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"

interface MassiveCreateProductData {
    products: CreateProductFormData[]
}

export const createMassiveProducts = async (data: MassiveCreateProductData) => {
    try {
        // Convertir priceList y priceCost a string en cada size
        const productsWithStringPrices = data.products.map((product) => ({
            ...product,
            sizes: product.sizes.map((size) => ({
                ...size,
                priceList: String(size.priceList),
                priceCost: String(size.priceCost),
            })),
        }))
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/crear-masivo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ products: productsWithStringPrices }),
        })

        if (res.status === 404) {
            revalidatePath("/inventory")
            return { success: true }
        }

        if (!res.ok) {
            return {
                success: false,
                error: `Error del servidor: ${res.status} ${res.statusText}`,
            }
        }

        revalidatePath("/inventory")
        return { success: true }
    } catch (err) {
        console.error("Error al crear productos:", err)
        return {
            success: false,
            error: "No se pudieron crear los productos. Verifica los datos o intenta más tarde.",
        }
    }
}
