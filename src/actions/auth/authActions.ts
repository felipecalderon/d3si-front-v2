// authActions.ts
import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IUser } from "@/interfaces/users/IUser"

type AuthResponse = {
    message: string
    cleanUsr: IUser
}

type ErrorMessage = {
    error?: string // ← opcional por si no siempre lo trae
}

export async function login(email: string, password: string) {
    return await fetcher<AuthResponse>(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
}

export async function register(name: string, email: string, role: string, password: string) {
    return await fetcher<AuthResponse & ErrorMessage>(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role, password }),
    })
}

export async function deleteUser(email: string) {
    return await fetcher<AuthResponse & ErrorMessage>(`${API_URL}/users/${email}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    })
}
