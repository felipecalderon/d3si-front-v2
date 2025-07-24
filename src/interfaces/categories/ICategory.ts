export interface ICategory {
    categoryID: string
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

export interface IChildCategory {
    categoryID: string
    name: string
    parentID: string
    createdAt: string
    updatedAt: string
}