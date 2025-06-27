"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UploadIcon, PlusIcon, PercentIcon, Trash2Icon } from "lucide-react"
import { format } from "date-fns"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { pdf } from "@react-pdf/renderer"
import { QuoteDocument } from "@/components/pdf/QuoteDocument"

export default function QuotesPage() {
    const [discounts, setDiscounts] = useState<
        { id: number; type: "Descuento" | "Cargo"; description: string; percentage: number }[]
    >([])

    const [vencimientoCantidad, setVencimientoCantidad] = useState("30")
    const [vencimientoPeriodo, setVencimientoPeriodo] = useState<"dias" | "semanas" | "meses">("dias")
    const [discountType, setDiscountType] = useState<"Descuento" | "Cargo">("Descuento")
    const [discountDescription, setDiscountDescription] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState("")

    const [products, setProducts] = useState<IProduct[]>([])
    const [selectedProductID, setSelectedProductID] = useState<string | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<
        {
            product: IProduct
            variation: IProductVariation
            quantity: number
        }[]
    >([])

    useEffect(() => {
        getAllProducts().then(setProducts)
    }, [])

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

    const handleAddDiscount = () => {
        if (!discountDescription || !discountPercentage) return
        setDiscounts([
            ...discounts,
            {
                id: Date.now(),
                type: discountType,
                description: discountDescription,
                percentage: Number(discountPercentage),
            },
        ])
        setDiscountDescription("")
        setDiscountPercentage("")
    }

    const handleRemoveDiscount = (id: number) => {
        setDiscounts(discounts.filter((d) => d.id !== id))
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

    const handleGenerateQuotePdf = async () => {
        if (selectedProducts.length === 0) {
            alert("Debe agregar al menos un producto.")
            return
        }

        const blob = await pdf(
            <QuoteDocument
                selectedProducts={selectedProducts}
                discounts={discounts}
                vencimientoCantidad={vencimientoCantidad}
                vencimientoPeriodo={vencimientoPeriodo}
                montoNeto={montoNeto}
                totalDescuentos={totalDescuentos}
                totalCargos={totalCargos}
                subtotal={subtotal}
                iva={iva}
                montoTotal={montoTotal}
            />
        ).toBlob()

        const url = URL.createObjectURL(blob)
        window.open(url)
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mr-3">
                        VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS
                    </h2>
                    <p>ALMARGO 593, PURÉN, LA ARAUCANÍA</p>
                    <p>alejandro.contreras@d3si.cl</p>
                </div>
                <div className="w-full max-w-xs">
                    <div className="border border-[#002147] rounded-md p-4 space-y-1">
                        <p>
                            <strong>R.U.T.:</strong> 77.058.146-K
                        </p>
                        <p>
                            <strong>COTIZACIÓN ELECTRÓNICA</strong>
                        </p>
                        <p>
                            <strong>N° 5100</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <div>
                    <p>
                        <span className="font-semibold">Emisión:</span> {format(new Date(), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <span className="font-semibold">Vencimiento:</span> {vencimientoCantidad}{" "}
                        {periodoLabel[vencimientoPeriodo]}
                    </p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Vencimiento</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cantidad"
                                className="w-20"
                                type="number"
                                min={1}
                                value={vencimientoCantidad}
                                onChange={(e) => setVencimientoCantidad(e.target.value)}
                            />
                            <Select
                                value={vencimientoPeriodo}
                                onValueChange={(value) => setVencimientoPeriodo(value as "dias" | "semanas" | "meses")}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Periodo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dias">Días</SelectItem>
                                    <SelectItem value="semanas">Semanas</SelectItem>
                                    <SelectItem value="meses">Meses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Datos del cliente */}
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <Input placeholder="RUT" />
                    <Input placeholder="Razón Social" />
                    <Input placeholder="Giro" />
                    <Input placeholder="Comuna" />
                    <Input placeholder="Email" />
                </CardContent>
            </Card>

            {/* Subir imagen */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Subir Imagen</label>
                <Button variant="outline" className="flex gap-2">
                    <UploadIcon size={16} />
                    Elegir Archivo
                </Button>
            </div>

            {/* Ingresar producto */}
            <div className="w-full border rounded-md p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <PlusIcon size={16} /> Ingrese producto
                </span>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    {/* Select de producto */}
                    <Select onValueChange={setSelectedProductID} value={selectedProductID ?? undefined}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Seleccionar Producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.productID} value={p.productID}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Select de talla */}
                    {selectedProductID && (
                        <Select onValueChange={handleAddProduct}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Seleccionar Talla" />
                            </SelectTrigger>
                            <SelectContent>
                                {products
                                    .find((p) => p.productID === selectedProductID)
                                    ?.ProductVariations.map((v) => (
                                        <SelectItem key={v.variationID} value={v.variationID}>
                                            {v.sizeNumber || "Sin talla"}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Detalle de cotización */}
            <div className="space-y-2">
                <h3 className="font-semibold">Detalle de Cotización</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Talla</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Neto Unitario</TableHead>
                            <TableHead>Subtotal Neto</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedProducts.map((sp) => (
                            <TableRow key={sp.variation.variationID}>
                                <TableCell>{sp.product.name}</TableCell>
                                <TableCell>{sp.variation.sizeNumber || "N/A"}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={sp.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(sp.variation.variationID, Number(e.target.value))
                                        }
                                        className="w-20"
                                    />
                                </TableCell>
                                <TableCell>${sp.variation.priceList}</TableCell>
                                <TableCell>${(sp.quantity * Number(sp.variation.priceList || 0)).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveProduct(sp.variation.variationID)}
                                    >
                                        <Trash2Icon size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Descuentos / Cargos */}
            <div className="space-y-4">
                <h3 className="font-semibold">Descuentos / Cargos</h3>
                <div className="flex flex-wrap gap-2">
                    <Input
                        placeholder="Descripción Ej: descuento por volumen"
                        className="flex-1 min-w-[180px]"
                        value={discountDescription}
                        onChange={(e) => setDiscountDescription(e.target.value)}
                    />
                    <Select
                        value={discountType}
                        onValueChange={(value) => setDiscountType(value === "Descuento" ? "Descuento" : "Cargo")}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Descuento/Cargo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Descuento">Descuento</SelectItem>
                            <SelectItem value="Cargo">Cargo</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                        <Input
                            placeholder="0-100"
                            className="w-[80px]"
                            type="number"
                            min={0}
                            max={100}
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                        />
                        <PercentIcon size={16} className="text-muted-foreground" />
                    </div>
                    <Button onClick={handleAddDiscount}>Agregar</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Porcentaje</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.type}</TableCell>
                                <TableCell>{d.description}</TableCell>
                                <TableCell>{d.percentage}%</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDiscount(d.id)}>
                                        <Trash2Icon size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Otras observaciones */}
            <div>
                <label className="text-sm font-medium">Otras Observaciones</label>
                <Textarea placeholder="Observaciones adicionales" />
            </div>

            {/* Totales y datos bancarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bancos */}
                <Card>
                    <CardContent className="space-y-2 py-4">
                        <h4 className="font-semibold">Datos de Transferencia Bancaria</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p>
                                    <strong>Banco Chile</strong>
                                </p>
                                <p>Cta Cte: 144 032 6403</p>
                                <p>Razón Social: D3SI SpA</p>
                                <p>RUT: 77.058.146-K</p>
                                <p>alejandro.contreras@d3si.cl</p>
                            </div>
                            <div>
                                <p>
                                    <strong>Banco Estado</strong>
                                </p>
                                <p>Cta Cte: 629 0034 9276</p>
                                <p>Razón Social: D3SI SpA</p>
                                <p>RUT: 77.058.146-K</p>
                                <p>alejandro.contreras@d3si.cl</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Totales */}
                <Card>
                    <CardContent className="space-y-2 py-4">
                        <h4 className="font-semibold">Resumen</h4>
                        <div className="space-y-1 text-sm">
                            <p>
                                Monto Neto: <span className="font-medium">${montoNeto.toFixed(2)}</span>
                            </p>
                            <p>
                                Descuentos: <span className="font-medium">-${totalDescuentos.toFixed(2)}</span>
                            </p>
                            <p>
                                Cargos: <span className="font-medium">+${totalCargos.toFixed(2)}</span>
                            </p>
                            <p>
                                Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </p>
                            <p>
                                IVA (19%): <span className="font-medium">${iva.toFixed(2)}</span>
                            </p>
                            <hr />
                            <p className="font-semibold">
                                Monto Total: <span className="font-bold">${montoTotal.toFixed(2)}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Botón Gener Cotizacion */}
            <div className="text-right">
                <Button onClick={handleGenerateQuotePdf}>Generar Cotización</Button>
            </div>
        </div>
    )
}
