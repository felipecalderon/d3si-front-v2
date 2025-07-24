import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import { getAllStores } from "@/actions/stores/getAllStores"
import PurchaseOrderClient from "@/components/PurchaseOrder/PurchaseOrderClient"

export default async function PurchaseOrderPage() {
    const [products, categories, stores] = await Promise.all([getAllProducts(), getAllCategories(), getAllStores()])

    return <PurchaseOrderClient initialProducts={products} initialCategories={categories} initialStores={stores} />
}
