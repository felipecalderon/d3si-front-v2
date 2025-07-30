"use client"

import { useEffect, useState } from "react"

export default function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const userUseDarkTheme = document.documentElement.classList.contains("dark")
        setIsDarkMode(userUseDarkTheme)
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode)
    }, [isDarkMode])

    return { isDarkMode, setIsDarkMode }
}
