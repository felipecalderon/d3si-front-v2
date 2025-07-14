export interface ICategory {
    categoryID: number
    id: string
    name: string
    parentID: string
    createdAt: string
    updatedAt: string
    subcategories: Array<{
        categoryID?: string
        name?: string
        parentID?: string
        createdAt?: string
        updatedAt?: string
    }>
}
