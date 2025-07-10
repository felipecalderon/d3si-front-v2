export interface ICategory {
    categoryID: number
    id: string
    name: string
    parentID: string
    createdAt: string
    updatedAt: string
    subcategories: Array<{
        name?: string
        parentID?: string
        createdAt?: string
        updatedAt?: string
    }>
}

export interface IChildCategory {
    name: string
    parentID: string
    createdAt: string
    updatedAt: string
}
