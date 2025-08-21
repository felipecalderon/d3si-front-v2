"use server"
import { cookies } from "next/headers"

export const getServerCookie = async () => {
    const { get } = await cookies()
    const dark = get("dark")
    return !!dark
}

export const setServerCookie = async (cookie: boolean) => {
    const { set } = await cookies()
    set("dark", JSON.stringify(cookie))
}
