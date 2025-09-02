export interface ICategory {
    categoryID: string
    name: string
    parentID: string
    createdAt: string
    updatedAt: string
    subcategories?: Array<ICategory>
}
