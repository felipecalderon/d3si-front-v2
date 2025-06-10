//src/app/inventory/create/page.tsx

"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"
import CreateProductForm from "@/components/Forms/CreateProductForm"

export default function CreateProductPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 flex-1">
                    <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>
                        <CreateProductForm />
                    </div>
                </main>
            </div>
        </div>
    )
}
