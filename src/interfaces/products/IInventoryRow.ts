export interface InventoryRow {
    Producto: string
    Género: string
    Marca: string
    Categoría: string
    TALLA: string | number | null
    "PRECIO COSTO": string | number
    "PRECIO PLAZA": string | number
    "CÓDIGO EAN": string | null
    OFERTAS: string | null
    "STOCK CENTRAL": number
    "STOCK AGREGADO": number
}
