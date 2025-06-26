import CreateProductForm from "@/components/Forms/CreateProductForm"

export default function CreateProductPage() {
    return (
        <main className="p-6 flex-1 min-h-screen">
            <div className="bg-white dark:bg-slate-800 dark:shadow-black border shadow-xl shadow-slate-500 rounded-xl p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">Crear Producto</h1>
                <CreateProductForm />
            </div>
        </main>
    )
}
