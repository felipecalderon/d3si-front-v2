import CreateProductForm from "@/components/Inventory/CreateProduct/CreateProductForm"
import { getAllCategories } from "@/actions/categories/getAllCategories"

export default async function CreateProductPage() {
    const [categories] = await Promise.all([getAllCategories()])
    return <CreateProductForm categories={categories} />
}
