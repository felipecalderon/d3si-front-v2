"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { QuoteDocument } from "@/components/Quotes/pdf/QuoteDocument"
import { pdf } from "@react-pdf/renderer"
import { ClientDataForm } from "@/components/Quotes//ClientDataForm/ClientDataForm"
import { ExpirationConfig } from "@/components/Quotes/ExpirationConfig/ExpirationConfig"
import { ProductImages } from "@/components/Quotes/Products/ProductImages"
import { ProductSelector } from "@/components/Quotes/Products/ProductSelector"
import { ProductTable } from "@/components/Quotes/Products/ProductTable"
import { DiscountsSection } from "@/components/Quotes/DiscountsSection/DiscountsSection"
import { FinancialSummary } from "@/components/Quotes/FinancialSummary/FinancialSummary"

interface QuotesClientProps {
    products: IProduct[]
}

// Tipo para descuentos/cargos procesados
interface ProcessedDiscount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    typeAndDescription: string
    percentage: number
    amount: number
}

// Tipo extendido para productos seleccionados
interface SelectedProduct {
    product: IProduct
    variation?: IProductVariation
    quantity: number
    availableModels: string
    unitPrice: number
    isCustomProduct?: boolean
}

export function QuotesClient({ products }: QuotesClientProps) {
    const [discounts, setDiscounts] = useState<
        { id: number; type: "Descuento" | "Cargo"; description: string; percentage: number }[]
    >([])
    const [productsImage, setProductsImage] = useState<{ id: string; image: string }[]>([])
    const [vencimientoCantidad, setVencimientoCantidad] = useState("30")
    const [vencimientoPeriodo, setVencimientoPeriodo] = useState<"dias" | "semanas" | "meses">("dias")
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
    const [observaciones, setObservaciones] = useState("")
    const [nroCotizacion, setNroCotizacion] = useState(5100)
    const [customProducts, setCustomProducts] = useState<IProduct[]>([]) // Para productos personalizados

    // Estados para datos del cliente
    const [clientData, setClientData] = useState({
        rut: "",
        razonSocial: "",
        giro: "",
        comuna: "",
        email: "",
        telefono: "",
    })

    useEffect(() => {
        const stored = localStorage.getItem("nroCotizacion")
        if (stored) {
            setNroCotizacion(Number(stored))
        }
    }, [])

    // Combinar productos originales con productos personalizados
    const allProducts = useMemo(() => {
        return [...products, ...customProducts]
    }, [products, customProducts])

    // Productos filtrados que excluyen los ya seleccionados
    const filteredProducts = useMemo(() => {
        const selectedProductIds = new Set(selectedProducts.map((sp) => sp.product.productID))
        return allProducts.filter((product) => !selectedProductIds.has(product.productID))
    }, [allProducts, selectedProducts])

    // Productos únicos seleccionados con contador
    const uniqueSelectedProducts = useMemo(() => {
        const productCounts = new Map<string, { product: IProduct; count: number }>()

        selectedProducts.forEach((sp) => {
            const productId = sp.product.productID
            if (productCounts.has(productId)) {
                productCounts.get(productId)!.count += sp.quantity
            } else {
                productCounts.set(productId, { product: sp.product, count: sp.quantity })
            }
        })

        return Array.from(productCounts.values())
    }, [selectedProducts])

    useEffect(() => {
        const updatedImages = uniqueSelectedProducts.map((productData) => {
            const existing = productsImage.find((p) => p.id === productData.product.productID)
            if (existing) return existing

            if (productData.product.image) {
                return {
                    id: productData.product.productID,
                    image: productData.product.image,
                }
            }

            return {
                id: productData.product.productID,
                image: "",
            }
        })

        setProductsImage(updatedImages)
    }, [uniqueSelectedProducts])

    const handleImageUpload = (productId: string, file: File) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Image = reader.result as string
            setProductsImage((prev) => prev.map((p) => (p.id === productId ? { ...p, image: base64Image } : p)))
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleProductSelect = (productId: string) => {
        const product = allProducts.find((p) => p.productID === productId)
        if (!product) return

        // Obtener modelos disponibles del producto (filtrar valores vacíos y duplicados)
        const availableModels =
            product.ProductVariations?.map((v) => v.sizeNumber)
                .filter((size) => size && size.trim() !== "")
                .filter((size, index, arr) => arr.indexOf(size) === index) // Eliminar duplicados
                .join(", ") || ""

        // Calcular precio promedio o usar el primer precio disponible
        const variations = product.ProductVariations || []
        const validPrices = variations.map((v) => Number(v.priceList || 0)).filter((price) => price > 0)

        const avgPrice =
            validPrices.length > 0 ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length : 0

        const newSelectedProduct: SelectedProduct = {
            product,
            quantity: 1,
            availableModels,
            unitPrice: Math.round(avgPrice), // Redondear al entero más cercano
            isCustomProduct: customProducts.some((cp) => cp.productID === productId),
        }

        setSelectedProducts([...selectedProducts, newSelectedProduct])
    }

    const handleAddNewProduct = (productData: { name: string; image?: string }) => {
        // Crear un producto personalizado
        const newProductId = `custom_${Date.now()}`
        const newProduct: IProduct = {
            productID: newProductId,
            name: productData.name,
            image: productData.image || "",
            ProductVariations: [], // Los productos personalizados no tienen variaciones predefinidas
            totalProducts: 0,
            categoryID: "",
            genre: "Unisex",
            brand: "Otro", // Usar una marca existente
            stock: 0, // Agregar la propiedad stock requerida
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            Category: undefined,
            description: "",
            wooID: null,
        }

        // Agregarlo a la lista de productos personalizados
        setCustomProducts((prev) => [...prev, newProduct])

        // Agregarlo también a la imagen si tiene una
        if (productData.image) {
            setProductsImage((prev) => [...prev, { id: newProductId, image: productData.image || "" }])
        }

        // Seleccionarlo automáticamente
        const newSelectedProduct: SelectedProduct = {
            product: newProduct,
            quantity: 1,
            availableModels: "",
            unitPrice: 0,
            isCustomProduct: true,
        }

        setSelectedProducts([...selectedProducts, newSelectedProduct])
    }

    const handleQuantityChange = (productId: string, quantity: number) => {
        setSelectedProducts(
            selectedProducts.map((sp) => (sp.product.productID === productId ? { ...sp, quantity } : sp))
        )
    }

    const handleModelsChange = (productId: string, models: string) => {
        setSelectedProducts(
            selectedProducts.map((sp) => (sp.product.productID === productId ? { ...sp, availableModels: models } : sp))
        )
    }

    const handleUnitPriceChange = (productId: string, price: number) => {
        setSelectedProducts(
            selectedProducts.map((sp) => (sp.product.productID === productId ? { ...sp, unitPrice: price } : sp))
        )
    }

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(selectedProducts.filter((sp) => sp.product.productID !== productId))

        // Si es un producto personalizado y no se usa en ningún lado más, eliminarlo
        const isCustomProduct = customProducts.some((cp) => cp.productID === productId)
        if (isCustomProduct) {
            setCustomProducts((prev) => prev.filter((cp) => cp.productID !== productId))
            setProductsImage((prev) => prev.filter((pi) => pi.id !== productId))
        }
    }

    const periodoLabel = {
        dias: Number(vencimientoCantidad) === 1 ? "día" : "días",
        semanas: Number(vencimientoCantidad) === 1 ? "semana" : "semanas",
        meses: Number(vencimientoCantidad) === 1 ? "mes" : "meses",
    }

    // Cálculos financieros mejorados
    const montoNeto = selectedProducts.reduce((acc, sp) => acc + sp.quantity * sp.unitPrice, 0)

    // Separar descuentos (porcentaje) de cargos (valor fijo)
    const totalDescuentos = discounts
        .filter((d) => d.type === "Descuento")
        .reduce((acc, d) => acc + montoNeto * (d.percentage / 100), 0)

    const totalCargos = discounts.filter((d) => d.type === "Cargo").reduce((acc, d) => acc + d.percentage, 0)

    const subtotal = montoNeto - totalDescuentos + totalCargos
    const iva = subtotal * 0.19
    const montoTotal = subtotal + iva

    // Procesamiento de descuentos/cargos para el PDF
    const processedDiscounts: ProcessedDiscount[] = useMemo(() => {
        return discounts.map((discount) => {
            let calculatedPercentage: number
            let calculatedAmount: number

            if (discount.type === "Descuento") {
                calculatedPercentage = discount.percentage
                calculatedAmount = montoNeto * (discount.percentage / 100)
            } else {
                calculatedAmount = discount.percentage
                calculatedPercentage = montoNeto > 0 ? (discount.percentage / montoNeto) * 100 : 0
            }

            return {
                id: discount.id,
                type: discount.type,
                description: discount.description,
                typeAndDescription: `[${discount.type.toUpperCase()}] ${discount.description}`,
                percentage: Math.round(calculatedPercentage * 100) / 100,
                amount: calculatedAmount,
            }
        })
    }, [discounts, montoNeto])

    // Función helper para crear variaciones mock
    const createMockVariation = (productId: string, models: string, price: number): IProductVariation => {
        return {
            variationID: `${productId}_default`,
            productID: productId,
            sizeNumber: models,
            priceList: price.toString(),
            priceCost: price.toString(),
            sku: "",
            stockQuantity: 0,
            StoreProducts: [],
            Stores: [],
        } as unknown as IProductVariation
    }

    const handleGeneratePDF = async () => {
        // Convertir selectedProducts al formato esperado por el PDF
        const pdfSelectedProducts = selectedProducts.map((sp) => ({
            product: sp.product,
            variation: sp.variation || createMockVariation(sp.product.productID, sp.availableModels, sp.unitPrice),
            quantity: sp.quantity,
        }))

        const blob = await pdf(
            <QuoteDocument
                selectedProducts={pdfSelectedProducts}
                productsImages={productsImage}
                processedDiscounts={processedDiscounts}
                vencimientoCantidad={vencimientoCantidad}
                vencimientoPeriodo={vencimientoPeriodo}
                montoNeto={montoNeto}
                totalDescuentos={totalDescuentos}
                totalCargos={totalCargos}
                subtotal={subtotal}
                iva={iva}
                montoTotal={montoTotal}
                nroCotizacion={nroCotizacion}
                clientData={{
                    rut: clientData.rut,
                    razonsocial: clientData.razonSocial,
                    giro: clientData.giro,
                    comuna: clientData.comuna,
                    email: clientData.email,
                    telefono: clientData.telefono,
                }}
                observaciones={observaciones}
            />
        ).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Cotizacion_${nroCotizacion}.pdf`
        link.click()
        URL.revokeObjectURL(url)
        const nextNro = nroCotizacion + 1
        setNroCotizacion(nextNro)
        localStorage.setItem("nroCotizacion", nextNro.toString())
    }

    return (
        <>
            {/* Configuración de Vencimiento */}
            <ExpirationConfig
                vencimientoCantidad={vencimientoCantidad}
                vencimientoPeriodo={vencimientoPeriodo}
                periodoLabel={periodoLabel}
                nroCotizacion={nroCotizacion}
                onCantidadChange={setVencimientoCantidad}
                onPeriodoChange={setVencimientoPeriodo}
            />

            {/* Formulario de Datos del Cliente */}
            <ClientDataForm clientData={clientData} onClientDataChange={setClientData} />

            {/* Imágenes de productos únicos con contador */}
            <ProductImages
                uniqueSelectedProducts={uniqueSelectedProducts}
                productsImage={productsImage}
                onImageUpload={handleImageUpload}
            />

            {/* Selector de Productos */}
            <ProductSelector
                filteredProducts={filteredProducts}
                onProductSelect={handleProductSelect}
                onAddNewProduct={handleAddNewProduct}
            />

            {/* Tabla de Productos */}
            {selectedProducts.length > 0 && (
                <ProductTable
                    selectedProducts={selectedProducts}
                    onQuantityChange={handleQuantityChange}
                    onModelsChange={handleModelsChange}
                    onUnitPriceChange={handleUnitPriceChange}
                    onRemoveProduct={handleRemoveProduct}
                />
            )}

            {/* Sección de Descuentos */}
            <DiscountsSection discounts={discounts} montoNeto={montoNeto} onDiscountsChange={setDiscounts} />

            {/* Observaciones */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Otras Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Observaciones adicionales sobre la cotización..."
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className="min-h-[100px] bg-white dark:bg-slate-700"
                    />
                </CardContent>
            </Card>

            {/* Resumen Financiero */}
            <FinancialSummary
                montoNeto={montoNeto}
                totalDescuentos={totalDescuentos}
                totalCargos={totalCargos}
                subtotal={subtotal}
                iva={iva}
                montoTotal={montoTotal}
            />

            {/* Botón Generar Cotización */}
            <div className="text-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGeneratePDF}>
                    Generar Cotización
                </Button>
            </div>
        </>
    )
}
