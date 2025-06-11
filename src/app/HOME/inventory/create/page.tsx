import CreateProductForm from "@/components/Forms/CreateProductForm"

export default function CreateProductPage() {
    return (
        <main className="p-6 flex-1 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-black border border-gray-400 rounded-xl p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Crear Producto</h1>
                <CreateProductForm />
            </div>
        </main>
    )
}
