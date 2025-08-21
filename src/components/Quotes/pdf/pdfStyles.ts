import { StyleSheet } from "@react-pdf/renderer"

export const pdfStyles = StyleSheet.create({
    // Página base
    page: { 
        padding: 24, 
        fontSize: 10, 
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
        lineHeight: 1.4
    },

    // Header con logo y empresa
    headerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: "2 solid #1e40af"
    },

    logoContainer: {
        marginRight: 15
    },

    companyLogo: {
        width: 250,
        height: 100,
        objectFit: "cover"
    },

    companyInfoContainer: {
        flex: 1
    },

    companyName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e40af",
        marginBottom: 5
    },

    companyInfo: {
        fontSize: 9,
        color: "#374151",
        marginBottom: 2
    },

    // Header de cotización
    quoteHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#f8fafc",
        padding: 15,
        border: "1 solid #cbd5e1"
    },

    quoteDatesContainer: {
        flex: 1
    },

    quoteDateText: {
        fontSize: 10,
        color: "#475569",
        marginBottom: 4
    },

    quoteNumberContainer: {
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: 12,
        textAlign: "center",
        minWidth: 160
    },

    quoteNumberTitle: {
        fontSize: 10,
        marginBottom: 4
    },

    quoteNumberValue: {
        fontSize: 16,
        fontWeight: "bold"
    },

    // Secciones generales
    sectionContainer: {
        marginBottom: 20
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        backgroundColor: "#e2e8f0",
        padding: 8,
        textAlign: "center",
        color: "#1e293b",
        marginBottom: 10
    },

    // Datos del cliente
    clientGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    clientField: {
        width: "50%",
        fontSize: 9,
        color: "#374151",
        marginBottom: 4
    },

    //imagenes de productos
    section: { marginBottom: 10 },
    subheading: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
        justifyContent: "flex-start",
        gap: 10,
    },

    // Tabla de productos
    table: {
        border: "1 solid #cbd5e1"
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: 8,
        fontWeight: "bold",
        fontSize: 10
    },

    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #e5e7eb",
        padding: 8,
        fontSize: 9,
        backgroundColor: "#ffffff"
    },

    tableRowAlternate: {
        flexDirection: "row",
        borderBottom: "1 solid #e5e7eb",
        padding: 8,
        fontSize: 9,
        backgroundColor: "#f9fafb"
    },

    // Columnas de tabla de productos
    productCol1: { width: "35%", paddingRight: 5 },
    productCol2: { width: "25%", paddingRight: 5 },
    productCol3: { width: "10%", paddingRight: 5, textAlign: "center" },
    productCol4: { width: "15%", paddingRight: 5, textAlign: "right" },
    productCol5: { width: "15%", textAlign: "right" },

    // Tabla de descuentos
    discountTable: {
        border: "1 solid #cbd5e1"
    },

    discountTableHeader: {
        flexDirection: "row",
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: 8,
        fontWeight: "bold",
        fontSize: 10
    },

    discountRow: {
        flexDirection: "row",
        borderBottom: "1 solid #e5e7eb",
        padding: 8,
        fontSize: 9,
        backgroundColor: "#ffffff"
    },

    discountRowAlternate: {
        flexDirection: "row",
        borderBottom: "1 solid #e5e7eb",
        padding: 8,
        fontSize: 9,
        backgroundColor: "#f9fafb"
    },

    // Columnas de tabla de descuentos
    discountCol1: { width: "50%" },
    discountCol2: { width: "25%", textAlign: "center" },
    discountCol3: { width: "25%", textAlign: "right" },

    // Observaciones
    observationsContainer: {
        backgroundColor: "#f8fafc",
        padding: 10,
        border: "1 solid #e2e8f0"
    },

    observationsText: {
        fontSize: 9,
        color: "#374151",
        lineHeight: 1.4
    },

    // Datos bancarios
    bankContainer: {
        flexDirection: "row",
        gap: 10
    },

    bankCard: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 10,
        border: "1 solid #cbd5e1"
    },

    bankName: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#1e40af",
        marginBottom: 5
    },

    bankInfo: {
        fontSize: 8,
        color: "#374151",
        marginBottom: 2
    },

    // Botón de pago
    paymentButtonContainer: {
        backgroundColor: "#fef3c7",
        padding: 10,
        border: "1 solid #f59e0b",
        textAlign: "center"
    },

    paymentButtonTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#92400e"
    },

    paymentButtonUrl: {
        fontSize: 9,
        color: "#1e40af"
    },

    // Resumen financiero
    summaryContainer: {
        backgroundColor: "#f8fafc",
        padding: 15,
        border: "1 solid #cbd5e1"
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },

    summaryLabel: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#374151"
    },

    summaryValue: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#374151"
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: 10,
        fontWeight: "bold",
        marginTop: 10
    },

    totalLabel: {
        fontSize: 12,
        fontWeight: "bold"
    },

    totalValue: {
        fontSize: 14,
        fontWeight: "bold"
    },

    // Imágenes de productos
    imagesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "flex-start"
    },

    imageItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#ffffff",
        padding: 8,
        border: "1 solid #e2e8f0"
    },

    productImage: {
        width: 70,
        height: 70,
        objectFit: "cover",
        border: "1 solid #cbd5e1",
        marginBottom: 6
    },

    imageLabel: {
        fontSize: 8,
        textAlign: "center",
        color: "#64748b",
        maxWidth: 70,
        lineHeight: 1.3
    },

    // Utilidades
    textBold: {
        fontWeight: "bold"
    },
    textCenter: {
        textAlign: "center"
    },
    textRight: {
        textAlign: "right"
    }
})

export default pdfStyles