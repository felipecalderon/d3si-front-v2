import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface SelectedProduct {
    product: IProduct
    variation: IProductVariation
    quantity: number
}

interface productImages {
    id: string
    image: string
}

interface Discount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    percentage: number
}

interface QuoteDocumentProps {
    selectedProducts: SelectedProduct[]
    productsImages: productImages[]
    discounts: Discount[]
    vencimientoCantidad: string
    vencimientoPeriodo: "dias" | "semanas" | "meses"
    montoNeto: number
    totalDescuentos: number
    totalCargos: number
    subtotal: number
    iva: number
    montoTotal: number
    nroCotizacion: number
    clientData: {
        rut: string
        razonsocial: string
        giro: string
        comuna: string
        email: string
        telefono: string
    }
    observaciones: string
}

// Estilos básicos
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
    section: { marginBottom: 10 },
    heading: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
    subheading: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
    tableHeader: {
        flexDirection: "row",
        borderBottom: "2 solid #000",
        padding: 4,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #eee",
        padding: 4,
    },
    cell: { flex: 1 },
    total: { fontSize: 12, fontWeight: "bold" },
    // Nuevos estilos para las imágenes
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
        justifyContent: "flex-start",
        gap: 10,
    },
    imageItem: {
        width: "30%",
        marginBottom: 10,
        alignItems: "center",
    },
    productImage: {
        width: 80,
        height: 80,
        objectFit: "cover",
        border: "1 solid #ddd",
        marginBottom: 4,
    },
    imageLabel: {
        fontSize: 8,
        textAlign: "center",
        color: "#666",
        maxWidth: 80,
    },
    noImagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: "#f5f5f5",
        border: "1 solid #ddd",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    noImageText: {
        fontSize: 8,
        color: "#999",
        textAlign: "center",
    },
})

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
    selectedProducts,
    productsImages,
    discounts,
    vencimientoCantidad,
    vencimientoPeriodo,
    montoNeto,
    totalDescuentos,
    totalCargos,
    subtotal,
    iva,
    montoTotal,
    nroCotizacion,
    clientData,
    observaciones,
}) => {
    // Crear un mapa de productos únicos para las imágenes
    const uniqueProducts = selectedProducts.reduce((acc, sp) => {
        if (!acc.find(p => p.productID === sp.product.productID)) {
            acc.push(sp.product);
        }
        return acc;
    }, [] as IProduct[]);

    return (
        <Document>
            <Page style={styles.page}>
                {/* Encabezado de empresa */}
                <View style={styles.section}>
                    <Text style={styles.heading}>D3SI Avocco</Text>
                    <Text>VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS</Text>
                    <Text>ALMAGRO 593, PURÉN, LA ARAUCANÍA</Text>
                    <Text>alejandro.contreras@d3si.cl</Text>
                    <Text>R.U.T.: 77.058.146-K</Text>
                    <Text style={{ marginTop: 4, fontWeight: "bold" }}>COTIZACIÓN N° {nroCotizacion}</Text>
                    <Text>Emisión: {new Date().toLocaleDateString()}</Text>
                    <Text>
                        Vencimiento: {vencimientoCantidad} {vencimientoPeriodo}
                    </Text>
                </View>

                {/* Datos del cliente */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Datos del Cliente</Text>
                    <Text>RUT: {clientData.rut}</Text>
                    <Text>Razón Social: {clientData.razonsocial}</Text>
                    <Text>Giro: {clientData.giro}</Text>
                    <Text>Comuna: {clientData.comuna}</Text>
                    <Text>Email: {clientData.email}</Text>
                    <Text>Teléfono: {clientData.telefono}</Text>
                </View>

                {/* Imágenes de productos */}
                {uniqueProducts.length > 0 && productsImages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.subheading}>Imágenes de Productos</Text>
                        <View style={styles.imagesContainer}>
                            {uniqueProducts.map((product) => {
                                const productImage = productsImages.find(img => img.id === product.productID);
                                
                                // Solo mostrar productos que tengan imagen
                                if (!productImage || !productImage.image || productImage.image.trim() === '') {
                                    return null;
                                }
                                
                                return (
                                    <View key={product.productID} style={styles.imageItem}>
                                        <Image 
                                            style={styles.productImage} 
                                            src={productImage.image}
                                            cache={false}
                                        />
                                        <Text style={styles.imageLabel}>
                                            {product.name.length > 20 
                                                ? `${product.name.substring(0, 20)}...` 
                                                : product.name
                                            }
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Productos */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Detalle de Productos</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.cell}>Item</Text>
                        <Text style={styles.cell}>Talla</Text>
                        <Text style={styles.cell}>Cantidad</Text>
                        <Text style={styles.cell}>Precio Neto Unitario</Text>
                        <Text style={styles.cell}>Subtotal Neto</Text>
                    </View>
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

                {/* Descuentos / Cargos */}
                {discounts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.subheading}>Descuentos / Cargos</Text>
                        {discounts.map((d) => (
                            <View key={d.id} style={styles.tableRow}>
                                <Text style={styles.cell}>{d.type}</Text>
                                <Text style={styles.cell}>{d.description}</Text>
                                <Text style={styles.cell}>{d.percentage}%</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Resumen */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Resumen</Text>
                    <Text>Monto Neto: ${montoNeto.toFixed(2)}</Text>
                    <Text>Descuentos: -${totalDescuentos.toFixed(2)}</Text>
                    <Text>Cargos: +${totalCargos.toFixed(2)}</Text>
                    <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
                    <Text>IVA: ${iva.toFixed(2)}</Text>
                    <Text style={styles.total}>TOTAL: ${montoTotal.toFixed(2)}</Text>
                </View>

                {/* Observaciones */}
                {observaciones && (
                    <View style={styles.section}>
                        <Text style={styles.subheading}>Otras Observaciones</Text>
                        <Text>{observaciones}</Text>
                    </View>
                )}

                {/* Datos Bancarios */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Datos de Transferencia Bancaria</Text>
                    <Text>Banco Chile</Text>
                    <Text>Cta Cte: 144 032 6403</Text>
                    <Text>Razón Social: D3SI SpA</Text>
                    <Text>RUT: 77.058.146-K</Text>
                    <Text>alejandro.contreras@d3si.cl</Text>
                    <Text style={{ marginTop: 4 }}>Banco Estado</Text>
                    <Text>Cta Cte: 629 0034 9276</Text>
                    <Text>Razón Social: D3SI SpA</Text>
                    <Text>RUT: 77.058.146-K</Text>
                    <Text>alejandro.contreras@d3si.cl</Text>
                </View>
            </Page>
        </Document>
    )
}