"use client"

import { useEffect, useState } from "react"

export default function useMobileScreen() {
    // Detect mobile screen size
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)

            // Only auto-collapse on desktop, not mobile
            if (!mobile) {
                setIsMobileOpen(false)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return { isMobile, isMobileOpen, setIsMobile, setIsMobileOpen }
}
