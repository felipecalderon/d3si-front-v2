"use client"
import { useAuth } from "@/stores/user.store"
import Image from "next/image"
import React from "react"

export default function Navbar() {
    const { user } = useAuth()
    return (
        <header className="flex justify-between items-center mb-6">
            <Image src="/brand/two-brands-color.png" width={200} height={120} alt="D3SI AVACCO" className="h-10" />
            <div className="flex items-center gap-4">
                <p className="font-semibold text-orange-600">Alejandro Contreras1</p>
                <p>{user?.message}</p>
                <Image
                    src="/brand/user-default.jpeg"
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </header>
    )
}
