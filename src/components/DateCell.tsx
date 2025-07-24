"use client"

import { useEffect, useState } from "react"

interface Props {
    date: string
}

export default function DateCell({ date }: Props) {
    const [formatted, setFormatted] = useState("")

    useEffect(() => {
        const dt = new Date(date)
        const formattedDate = dt.toLocaleString("es-CL", {
            timeZone: "America/Santiago",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        setFormatted(formattedDate)
    }, [date])

    if (!formatted) return null

    return <>{formatted}</>
}
