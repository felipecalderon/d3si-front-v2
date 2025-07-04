import { SaleForm } from "@/components/CreateSale/SaleForm"

const CreateSale = () => {
    return (
        <main className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto dark:bg-slate-800 bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-4">Sección de Ventas</h1>
                <SaleForm />
            </div>
        </main>
    )
}

export default CreateSale
