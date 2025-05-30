import React from "react"

export default function Navbar() {
    return (
        <header className="flex justify-between items-center mb-6">
            <img src="/logo-d3si.png" alt="D3SI AVACCO" className="h-10" />
            <div className="flex items-center gap-4">
                <p className="font-semibold text-orange-600">Alejandro Contreras1</p>
                <img src="/user.jpg" alt="User" className="w-10 h-10 rounded-full" />
            </div>
        </header>
    )
}
