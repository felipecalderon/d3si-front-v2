"use client"

import { getServerCookie, setServerCookie } from "@/actions/cookies/server.cookies"
import { useEffect, useState } from "react"

export default function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null) // null para estado inicial indefinido

    // Efecto para inicializar estado desde cookie o sistema
    useEffect(() => {
        getServerCookie().then((cookieValue) => {
            if (cookieValue !== null && cookieValue !== undefined) {
                setIsDarkMode(cookieValue)
            } else {
                // Leer preferencia sistema si no hay cookie
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                setIsDarkMode(prefersDark)
            }
        })
    }, [])

    // Efecto para sincronizar DOM y cookie con estado isDarkMode (cuando cambia)
    useEffect(() => {
        if (isDarkMode === null) return // Esperando a que cargue el valor inicial

        document.documentElement.classList.toggle("dark", isDarkMode)
        setServerCookie(isDarkMode)
    }, [isDarkMode])

    return { isDarkMode, setIsDarkMode }
}
