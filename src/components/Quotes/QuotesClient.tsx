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

export function QuotesClient({ products }: QuotesClientProps) {
    const [discounts, setDiscounts] = useState<
        { id: number; type: "Descuento" | "Cargo"; description: string; percentage: number }[]
    >([])
    const [productsImage, setProductsImage] = useState<{ id: string; image: string }[]>([])
    const [vencimientoCantidad, setVencimientoCantidad] = useState("30")
    const [vencimientoPeriodo, setVencimientoPeriodo] = useState<"dias" | "semanas" | "meses">("dias")
    const [selectedProductID, setSelectedProductID] = useState<string | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<
        {
            product: IProduct
            variation: IProductVariation
            quantity: number
        }[]
    >([])
    const [observaciones, setObservaciones] = useState("")
    const [nroCotizacion, setNroCotizacion] = useState(5100)
    
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

    // Productos filtrados que excluyen las variaciones ya seleccionadas
    const filteredProducts = useMemo(() => {
        const selectedVariationIds = new Set(selectedProducts.map((sp) => sp.variation.variationID))

        return products.filter((product) => {
            const availableVariations = product.ProductVariations.filter(
                (variation) => !selectedVariationIds.has(variation.variationID)
            )
            return availableVariations.length > 0
        })
    }, [products, selectedProducts])

    // Variaciones disponibles para el producto seleccionado
    const availableVariationsForSelectedProduct = useMemo(() => {
        if (!selectedProductID) return []

        const selectedVariationIds = new Set(selectedProducts.map((sp) => sp.variation.variationID))
        const product = products.find((p) => p.productID === selectedProductID)

        if (!product) return []

        return product.ProductVariations.filter((variation) => !selectedVariationIds.has(variation.variationID))
    }, [selectedProductID, products, selectedProducts])

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

    const handleAddProduct = (variationID: string) => {
        const product = products.find((p) => p.productID === selectedProductID)
        if (!product) return
        const variation = product.ProductVariations.find((v) => v.variationID === variationID)
        if (!variation) return
        setSelectedProducts([...selectedProducts, { product, variation, quantity: 1 }])
        setSelectedProductID(null)
    }

    const handleQuantityChange = (variationID: string, quantity: number) => {
        setSelectedProducts(
            selectedProducts.map((sp) => (sp.variation.variationID === variationID ? { ...sp, quantity } : sp))
        )
    }

    const handleRemoveProduct = (variationID: string) => {
        setSelectedProducts(selectedProducts.filter((sp) => sp.variation.variationID !== variationID))
    }

    const periodoLabel = {
        dias: Number(vencimientoCantidad) === 1 ? "día" : "días",
        semanas: Number(vencimientoCantidad) === 1 ? "semana" : "semanas",
        meses: Number(vencimientoCantidad) === 1 ? "mes" : "meses",
    }

    const montoNeto = selectedProducts.reduce((acc, sp) => acc + sp.quantity * Number(sp.variation.priceList || 0), 0)

    const totalDescuentos = discounts
        .filter((d) => d.type === "Descuento")
        .reduce((acc, d) => acc + montoNeto * (d.percentage / 100), 0)

    const totalCargos = discounts
        .filter((d) => d.type === "Cargo")
        .reduce((acc, d) => acc + montoNeto * (d.percentage / 100), 0)

    const subtotal = montoNeto - totalDescuentos + totalCargos
    const iva = subtotal * 0.19
    const montoTotal = subtotal + iva

    const handleGeneratePDF = async () => {
        const blob = await pdf(
            <QuoteDocument
                selectedProducts={selectedProducts}
                productsImages={productsImage}
                discounts={discounts}
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
                selectedProductID={selectedProductID}
                availableVariationsForSelectedProduct={availableVariationsForSelectedProduct}
                onProductSelect={setSelectedProductID}
                onAddProduct={handleAddProduct}
            />

            {/* Tabla de Productos */}
            {selectedProducts.length > 0 && (
                <ProductTable
                    selectedProducts={selectedProducts}
                    onQuantityChange={handleQuantityChange}
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