
import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

type ErrorMessage = {
    error: string
}

export async function deleteStore(storeID: string) {
    return await fetcher<ErrorMessage>(`${API_URL}/store?storeID=${storeID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({storeID}),
    })
}
