import { SaleForm } from "@/components/CreateSale/SaleForm"
import TitleSelectedStore from "@/components/CreateSale/TitleSelectedStore"
const CreateSale = () => {
    return (
        <main className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto dark:bg-slate-800 bg-white shadow-xl rounded-2xl p-6">
                <TitleSelectedStore />
                <SaleForm />
            </div>
        </main>
    )
}

export default CreateSale
