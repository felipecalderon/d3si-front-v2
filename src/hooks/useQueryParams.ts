"use client"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function useQueryParams() {
    const searchParams = useSearchParams()

    const createQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    return { searchParams, createQueryParam }
}
