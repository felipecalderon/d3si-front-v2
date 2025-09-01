import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

type ErrorMessage = {
    error: string
}

export async function deleteCategory(categoryID: string) {
    return await fetcher<ErrorMessage>(`${API_URL}/categories/${categoryID}`, {
        method: "DELETE",
    })
}
