export interface InventoryRow {
    Producto: string
    "CÓDIGO EAN": string | null
    TALLA: string | number | null
    "PRECIO COSTO": string | number
    "PRECIO PLAZA": string | number
    "STOCK CENTRAL": number
    "STOCK AGREGADO": number
}
