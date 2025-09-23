import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import { getAllStores } from "@/actions/stores/getAllStores"
import InventoryClientWrapper from "@/components/Inventory/InventoryClientWrapper"
import { prepareProductsForWoo } from "@/utils/mappers/saleProductsToWooItems"

export default async function InventoryPage() {
    // Lógica de obtención en servidor
    const [productsData, categoriesData, storesData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllStores(),
    ])
    /**
     * 1) Generar el mapper para crear productos en woo - Separar productos simples de variantes
     * 1.1) ¿Generar 2 mappers diferentes uno solo para productos y otro solo para variantes?
     * 
     * payload: {toCreate: WooProduct[], toUpdate: WooProduct[]}
     *
     * 2) Crear productos padre y la respuesta viene con wooID
     *
     * 3) Actualizar el sistema que tiene wooID = null con la obtenida desde woocommerce
     *
     * 4) Acá tendríamos el payload de las VARIACIONES (new Map<number, WooProduct>())
     * 
        [GET, POST, PUT, DELETE]
        wp-json/wc/v3/products/[wooID] <- Productos padres o simples
        wp-json/wc/v3/products/[wooID]/variations/[wooID] <- variaciones
     */

    console.log(prepareProductsForWoo(productsData).productPayloads[0])
    return (
        <main className="p-6 flex-1 flex flex-col h-screen">
            {/* <InventoryClientWrapper initialProducts={productsData} categories={categoriesData} stores={storesData} /> */}
            <InventoryClientWrapper initialProducts={productsData} categories={categoriesData} stores={storesData} />
        </main>
    )
}
