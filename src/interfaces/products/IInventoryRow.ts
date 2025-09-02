export interface InventoryRow {
    Producto: string
    Imagen: string
    Género: string
    Marca: string
    Categoría: string
    Talla: string | number | null
    Cantidad: number
    "Precio Costo Neto": string | number
    "Precio Plaza": string | number
    "Código EAN": string | null
}
