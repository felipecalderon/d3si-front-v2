import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import { getAllStores } from "@/actions/stores/getAllStores"
import InventoryClientWrapper from "@/components/Inventory/InventoryClientWrapper"

export default async function InventoryPage() {
    // Lógica de obtención en servidor
    const [productsData, categoriesData, storesData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllStores(),
    ])

    return (
        <main className="p-6 flex-1 flex flex-col h-screen">
            <InventoryClientWrapper initialProducts={productsData} categories={categoriesData} stores={storesData} />
        </main>
    )
}
