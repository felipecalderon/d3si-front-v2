import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface SelectedProduct {
    product: IProduct
    variation: IProductVariation
    quantity: number
}

interface Discount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    percentage: number
}

interface QuoteDocumentProps {
    selectedProducts: SelectedProduct[]
    discounts: Discount[]
    vencimientoCantidad: string
    vencimientoPeriodo: "dias" | "semanas" | "meses"
    montoNeto: number
    totalDescuentos: number
    totalCargos: number
    subtotal: number
    iva: number
    montoTotal: number
}

// Estilos básicos
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
    section: { marginBottom: 10 },
    heading: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
    tableRow: { flexDirection: "row", borderBottom: "1 solid #eee", padding: 4 },
    cell: { flex: 1 },
    total: { fontSize: 12, fontWeight: "bold" },
})

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
    selectedProducts,
    discounts,
    vencimientoCantidad,
    vencimientoPeriodo,
    montoNeto,
    totalDescuentos,
    totalCargos,
    subtotal,
    iva,
    montoTotal,
}) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.heading}>COTIZACIÓN ELECTRÓNICA</Text>
                <Text>Emisión: {new Date().toLocaleDateString()}</Text>
                <Text>
                    Vencimiento: {vencimientoCantidad} {vencimientoPeriodo}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.heading}>Productos</Text>
                {selectedProducts.map((sp, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={styles.cell}>{sp.product.name}</Text>
                        <Text style={styles.cell}>{sp.variation.sizeNumber || "N/A"}</Text>
                        <Text style={styles.cell}>{sp.quantity}</Text>
                        <Text style={styles.cell}>${sp.variation.priceList}</Text>
                        <Text style={styles.cell}>${(sp.quantity * Number(sp.variation.priceList)).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {discounts.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.heading}>Descuentos / Cargos</Text>
                    {discounts.map((d) => (
                        <View key={d.id} style={styles.tableRow}>
                            <Text style={styles.cell}>{d.type}</Text>
                            <Text style={styles.cell}>{d.description}</Text>
                            <Text style={styles.cell}>{d.percentage}%</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.heading}>Resumen</Text>
                <Text>Monto Neto: ${montoNeto.toFixed(2)}</Text>
                <Text>Descuentos: -${totalDescuentos.toFixed(2)}</Text>
                <Text>Cargos: +${totalCargos.toFixed(2)}</Text>
                <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
                <Text>IVA: ${iva.toFixed(2)}</Text>
                <Text style={styles.total}>TOTAL: ${montoTotal.toFixed(2)}</Text>
            </View>
        </Page>
    </Document>
)
