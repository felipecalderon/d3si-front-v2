import CreateProductForm from "@/components/Forms/CreateProductForm"

export default function CreateProductPage() {
    return (
        <main className="p-6 flex-1">
            <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>
                <CreateProductForm />
            </div>
        </main>
    )
}
