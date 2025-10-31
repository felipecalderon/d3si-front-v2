import { ISaleProduct, IsaleProductReturned, ISaleResponse } from "@/interfaces/sales/ISale"

export const getAnulatedProducts = (sale: ISaleResponse): ISaleProduct[] => {
    //    Usamos el storeProductID como clave.
    const anulationMap = new Map<string, IsaleProductReturned>()
    if (!sale.Return) return []
    const { SaleProducts, Return } = sale
    const { ProductAnulations } = Return
    ProductAnulations.forEach((anul) => {
        anulationMap.set(anul.storeProductID, anul)
    })

    const anulatedProducts: ISaleProduct[] = SaleProducts
        // ➡️ Filtrar: Solo mantiene los productos que tienen un registro en el mapa de anulaciones.
        .filter((saleP) => anulationMap.has(saleP.storeProductID))

        // 🔄 Mapear: Transforma el objeto ISaleProduct.
        .map((saleP) => {
            const anulationData = anulationMap.get(saleP.storeProductID)! // Es seguro por el filtro

            // Crear una copia del producto vendido.
            const modifiedProduct: ISaleProduct = { ...saleP }

            // Sobreescribir los datos importantes.
            modifiedProduct.quantitySold = anulationData.returnedQuantity
            modifiedProduct.subtotal = anulationData.returnedQuantity * parseFloat(anulationData.unitPrice)
            return modifiedProduct
        })

    return anulatedProducts
}
