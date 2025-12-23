// src/actions/products/deleteProduct.ts
import { fetcher } from "@/lib/fetcher"

export async function deleteProduct(productID: string) {
    return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/products/${productID}`, {
        method: "DELETE",
    })
}

export async function deleteVariation(sku: string) {
    return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/products/calzado/${sku}`, {
        method: "DELETE",
    })
}
