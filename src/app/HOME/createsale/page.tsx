import { SaleForm } from "@/components/Forms/SaleForm"

const CreateSale = () => {
    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Sección de Ventas</h1>
                <SaleForm />
            </div>
        </main>
    )
}

export default CreateSale
