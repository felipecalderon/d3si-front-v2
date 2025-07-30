import React from "react"
import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { pdfStyles } from "./pdfStyles"
import fs from "fs"

interface SelectedProduct {
    product: IProduct
    variation: IProductVariation
    quantity: number
}

interface ProductImages {
    id: string
    image: string
}

interface ProcessedDiscount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    typeAndDescription: string
    percentage: number
    amount: number
}

interface QuoteDocumentProps {
    selectedProducts: SelectedProduct[]
    productsImages: ProductImages[]
    processedDiscounts: ProcessedDiscount[]
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

// Función para calcular la fecha de vencimiento
const calculateExpirationDate = (cantidad: string, periodo: "dias" | "semanas" | "meses"): string => {
    const emissionDate = new Date()
    const cantidadNum = parseInt(cantidad)

    let expirationDate = new Date(emissionDate)

    switch (periodo) {
        case "dias":
            expirationDate.setDate(expirationDate.getDate() + cantidadNum)
            break
        case "semanas":
            expirationDate.setDate(expirationDate.getDate() + cantidadNum * 7)
            break
        case "meses":
            expirationDate.setMonth(expirationDate.getMonth() + cantidadNum)
            break
    }

    return expirationDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

// Función para formatear moneda chilena
const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
    selectedProducts,
    productsImages,
    processedDiscounts,
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
        if (!acc.find((p) => p.productID === sp.product.productID)) {
            acc.push(sp.product)
        }
        return acc
    }, [] as IProduct[])

    const emissionDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const expirationDate = calculateExpirationDate(vencimientoCantidad, vencimientoPeriodo)

    return (
        <Document>
            <Page style={pdfStyles.page}>
                {/* Header con logo y datos de la empresa */}
                <View style={pdfStyles.headerContainer}>
                    <View style={pdfStyles.logoContainer}>
                        <Image
                            style={pdfStyles.companyLogo}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACOCAYAAACL3jUkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmExY2QxMmY0MSwgMjAyNC8xMS8wOC0xNjowOToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNGREQ3MzVBMDRDNjExRjBCNjgwODZDOTM2MDk0OUJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNGREQ3MzVCMDRDNjExRjBCNjgwODZDOTM2MDk0OUJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0ZERDczNTgwNEM2MTFGMEI2ODA4NkM5MzYwOTQ5QkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0ZERDczNTkwNEM2MTFGMEI2ODA4NkM5MzYwOTQ5QkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz77bwTuAAAZMUlEQVR42uxd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"
                            cache={false}
                        />
                    </View>
                    <View style={pdfStyles.companyInfoContainer}>
                        <Text style={pdfStyles.companyName}>D3SI SPA</Text>
                        <Text style={pdfStyles.companyInfo}>
                            VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS
                        </Text>
                        <Text style={pdfStyles.companyInfo}>ALMAGRO 593, PURÉN, LA ARAUCANÍA</Text>
                        <Text style={pdfStyles.companyInfo}>ALEJANDRO.CONTRERAS@D3SI.CL</Text>
                        <Text style={pdfStyles.companyInfo}>R.U.T.: 77.058.146-K</Text>
                    </View>
                </View>

                {/* Header de cotización */}
                <View style={pdfStyles.quoteHeaderContainer}>
                    <View style={pdfStyles.quoteDatesContainer}>
                        <Text style={pdfStyles.quoteDateText}>Emisión: {emissionDate}</Text>
                        <Text style={pdfStyles.quoteDateText}>Vencimiento: {expirationDate}</Text>
                    </View>
                    <View style={pdfStyles.quoteNumberContainer}>
                        <Text style={pdfStyles.quoteNumberTitle}>COTIZACIÓN ELECTRÓNICA</Text>
                        <Text style={pdfStyles.quoteNumberValue}>N° {nroCotizacion}</Text>
                    </View>
                </View>

                {/* Datos del cliente */}
                <View style={pdfStyles.sectionContainer}>
                    <Text style={pdfStyles.sectionTitle}>Datos del Cliente</Text>
                    <View style={pdfStyles.clientGrid}>
                        <Text style={pdfStyles.clientField}>R.U.T.: {clientData.rut}</Text>
                        <Text style={pdfStyles.clientField}>TELÉFONO: {clientData.telefono}</Text>
                        <Text style={pdfStyles.clientField}>RAZÓN SOCIAL: {clientData.razonsocial}</Text>
                        <Text style={pdfStyles.clientField}>EMAIL: {clientData.email}</Text>
                        <Text style={pdfStyles.clientField}>GIRO: {clientData.giro}</Text>
                        <Text style={pdfStyles.clientField}>COMUNA: {clientData.comuna}</Text>
                    </View>
                </View>

                {/* Imágenes de productos */}
                {uniqueProducts.length > 0 && productsImages.length > 0 && (
                    <View style={pdfStyles.section}>
                        <Text style={pdfStyles.subheading}>Imágenes de Productos</Text>
                        <View style={pdfStyles.imagesContainer}>
                            {uniqueProducts.map((product) => {
                                const productImage = productsImages.find((img) => img.id === product.productID)

                                // Solo mostrar productos que tengan imagen
                                if (!productImage || !productImage.image || productImage.image.trim() === "") {
                                    return null
                                }

                                return (
                                    <View key={product.productID} style={pdfStyles.imageItem}>
                                        <Image style={pdfStyles.productImage} src={productImage.image} cache={false} />
                                        <Text style={pdfStyles.imageLabel}>
                                            {product.name.length > 20
                                                ? `${product.name.substring(0, 20)}...`
                                                : product.name}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                )}

                {/* Tabla de productos */}
                <View style={pdfStyles.sectionContainer}>
                    <View style={pdfStyles.table}>
                        <View style={pdfStyles.tableHeader}>
                            <Text style={pdfStyles.productCol1}>Item</Text>
                            <Text style={pdfStyles.productCol2}>Modelos disponibles</Text>
                            <Text style={pdfStyles.productCol3}>Cantidad</Text>
                            <Text style={pdfStyles.productCol4}>Precio</Text>
                            <Text style={pdfStyles.productCol5}>Subtotal</Text>
                        </View>

                        {selectedProducts.map((sp, idx) => {
                            // Obtener todas las tallas del producto
                            const allSizes = sp.product.ProductVariations.map((v) => v.sizeNumber)
                                .filter((size) => size)
                                .join(" ")
                            const displayModels = sp.variation?.sizeNumber || "N/A"
                            return (
                                <View
                                    key={idx}
                                    style={idx % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlternate}
                                >
                                    <Text style={pdfStyles.productCol1}>{sp.product.name}</Text>
                                    <Text style={pdfStyles.productCol2}>{displayModels}</Text>{" "}
                                    {/* ✅ Usa displayModels */}
                                    <Text style={pdfStyles.productCol3}>{sp.quantity}</Text>
                                    <Text style={pdfStyles.productCol4}>
                                        {formatCurrency(Number(sp.variation.priceList))}
                                    </Text>
                                    <Text style={pdfStyles.productCol5}>
                                        {formatCurrency(sp.quantity * Number(sp.variation.priceList))}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Descuentos y Cargos */}
                {processedDiscounts.length > 0 && (
                    <View style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.sectionTitle}>Descuentos/Cargos</Text>
                        <View style={pdfStyles.discountTable}>
                            <View style={pdfStyles.discountTableHeader}>
                                <Text style={pdfStyles.discountCol1}>Tipo (descuento/cargo)</Text>
                                <Text style={pdfStyles.discountCol2}>Porcentaje</Text>
                                <Text style={pdfStyles.discountCol3}>Monto</Text>
                            </View>

                            {processedDiscounts.map((d, index) => (
                                <View
                                    key={d.id}
                                    style={index % 2 === 0 ? pdfStyles.discountRow : pdfStyles.discountRowAlternate}
                                >
                                    <Text style={pdfStyles.discountCol1}>
                                        [{d.type.toUpperCase()}] {d.description}
                                    </Text>
                                    <Text style={pdfStyles.discountCol2}>
                                        {d.type === "Descuento"
                                            ? `${d.percentage.toFixed(1)}%`
                                            : `${d.percentage.toFixed(1)}%`}
                                    </Text>
                                    <Text style={pdfStyles.discountCol3}>${d.amount.toLocaleString("es-CL")}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Observaciones - Solo si hay contenido */}
                {observaciones && observaciones.trim() !== "" && (
                    <View style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.sectionTitle}>Observaciones</Text>
                        <View style={pdfStyles.observationsContainer}>
                            <Text style={pdfStyles.observationsText}>{observaciones}</Text>
                        </View>
                    </View>
                )}

                {/* Datos bancarios */}
                <View style={pdfStyles.sectionContainer}>
                    <Text style={pdfStyles.sectionTitle}>Datos de Transferencia Bancaria</Text>
                    <View style={pdfStyles.bankContainer}>
                        <View style={pdfStyles.bankCard}>
                            <Text style={pdfStyles.bankName}>Banco de Chile</Text>
                            <Text style={pdfStyles.bankInfo}>Cta Cte: 144 032 6403</Text>
                            <Text style={pdfStyles.bankInfo}>Razón Social: D3SI SpA</Text>
                            <Text style={pdfStyles.bankInfo}>Rut: 77.058.146-K</Text>
                            <Text style={pdfStyles.bankInfo}>alejandro.contreras@d3si.cl</Text>
                        </View>
                        <View style={pdfStyles.bankCard}>
                            <Text style={pdfStyles.bankName}>Banco Estado</Text>
                            <Text style={pdfStyles.bankInfo}>Cta Cte: 629 0034 9276</Text>
                            <Text style={pdfStyles.bankInfo}>Razón Social: D3SI SpA</Text>
                            <Text style={pdfStyles.bankInfo}>Rut: 77.058.146-K</Text>
                            <Text style={pdfStyles.bankInfo}>alejandro.contreras@d3si.cl</Text>
                        </View>
                    </View>
                </View>

                {/* Botón de Pago Transbank */}
                <View style={{ marginBottom: 20, backgroundColor: "#fff3cd", padding: 10, border: "1 solid #ffeaa7" }}>
                    <Text style={{ fontSize: 10, fontWeight: "bold", textAlign: "center", marginBottom: 5 }}>
                        Botón de Pago Transbank hasta 6 cuotas con tarjeta de crédito
                    </Text>
                    <Text style={{ fontSize: 9, textAlign: "center", color: "#0066cc" }}>
                        https://www.webpay.cl/form-pay/157318
                    </Text>
                </View>

                {/* Resumen financiero */}
                <View style={{ backgroundColor: "#f8f9fa", padding: 15, border: "1 solid #dee2e6" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>MONTO NETO:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{formatCurrency(montoNeto)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>DESCUENTOS:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{formatCurrency(totalDescuentos)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>CARGOS:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{formatCurrency(totalCargos)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>SUBTOTAL:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>IVA 19%:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{formatCurrency(iva)}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: 10,
                            fontWeight: "bold",
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: "bold" }}>MONTO TOTAL:</Text>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{formatCurrency(montoTotal)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}