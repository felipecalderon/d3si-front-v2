export interface ICategory {
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
