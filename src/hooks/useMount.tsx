"use client"
import { useEffect, useState } from "react"

export const useMount = () => {
    const [isMount, setMount] = useState(false)
    useEffect(() => {
        setMount(true)
    }, [])

    return { isMount }
}
