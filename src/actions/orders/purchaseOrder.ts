"use server"

interface OrderProduct {
    variationID: string
    quantityOrdered: number
}

interface CreateOrderData {
    storeID: string
    userID: string
    products: OrderProduct[]
}

export const createOrder = async (data: CreateOrderData) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            return {
                success: false,
                error: `Error del servidor: ${res.status} ${res.statusText}`,
            }
        }

        return { success: true }
    } catch (err) {
        console.error("Error al crear la orden:", err)
        return {
            success: false,
            error: "No se pudo crear la orden. Verifica los datos o intenta más tarde.",
        }
    }
}
