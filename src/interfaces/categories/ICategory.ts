export interface ICategory {
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
