import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"

type AuthResponse = {
    token: string
    user: {
        id: string
        email: string
        //Se pueden agregar mas campos según sea necesario (cuando el backend devuelva mas datos)
    }
}

type ErrorMessage = {
    error: string
}

export async function login(email: string, password: string) {
    return await fetcher<AuthResponse & ErrorMessage>(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
}

export async function register(nombre: string, email: string, password: string, typeOfUser: string) {
    return await fetcher<AuthResponse>(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password, typeOfUser }),
    })
}
