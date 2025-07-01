"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    UploadIcon, 
    PlusIcon, 
    PercentIcon, 
    Trash2Icon, 
    FileTextIcon,
    BuildingIcon,
    MailIcon,
    CalendarIcon,
    DollarSignIcon
} from "lucide-react"
import { format } from "date-fns"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
//import { PDFDownloadLink } from "@react-pdf/renderer"
import { QuoteDocument } from "@/components/pdf/QuoteDocument"
import { pdf } from "@react-pdf/renderer"

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

    const [rut, setRut] = useState("")
    const [razonSocial, setRazonSocial] = useState("")
    const [giro, setGiro] = useState("")
    const [comuna, setComuna] = useState("")
    const [email, setEmail] = useState("")
    const [observaciones, setObservaciones] = useState("")

    const handleGeneratePDF = async () => {
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
                nroCotizacion={5100}
                clientData={{
                    rut,
                    razonsocial: razonSocial,
                    giro,
                    comuna,
                    email,
                }}
                observaciones={observaciones}
            />
        ).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Cotizacion_${5100}.pdf`
        link.click()
        URL.revokeObjectURL(url)
    }
    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="min-h-screen ">
                <div className="container mx-auto py-8 px-4 space-y-8">
                    {/* Header Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BuildingIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                                D3SI SpA
                                            </h1>
                                            <p className="text-slate-600 dark:text-slate-300">
                                                VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <p className="flex items-center gap-2">
                                            <BuildingIcon className="h-4 w-4" />
                                            ALMARGO 593, PURÉN, LA ARAUCANÍA
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MailIcon className="h-4 w-4" />
                                            alejandro.contreras@d3si.cl
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="w-full lg:w-auto">
                                    <Card className="border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/50">
                                        <CardContent className="p-6 text-center space-y-2">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                R.U.T.: 77.058.146-K
                                            </Badge>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-800 dark:text-white">COTIZACIÓN ELECTRÓNICA</p>
                                                <p className="text-2xl font-bold text-blue-600">N° 5100</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Fechas y Vencimiento */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span className="font-medium">Emisión:</span>
                                        <span>{format(new Date(), "dd/MM/yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span className="font-medium">Vencimiento:</span>
                                        <span>{vencimientoCantidad} {periodoLabel[vencimientoPeriodo]}</span>
                                    </div>
                                </div>
                                
                                <Card className="w-full sm:w-auto bg-slate-50 dark:bg-slate-700">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                                Configurar Vencimiento
                                            </label>
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
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Datos del Cliente */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                                <FileTextIcon className="h-5 w-5 text-blue-600" />
                                Datos del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input 
                                    placeholder="RUT" 
                                    value={rut} 
                                    onChange={(e) => setRut(e.target.value)}
                                    className="bg-white dark:bg-slate-700"
                                />
                                <Input
                                    placeholder="Razón Social"
                                    value={razonSocial}
                                    onChange={(e) => setRazonSocial(e.target.value)}
                                    className="bg-white dark:bg-slate-700"
                                />
                                <Input 
                                    placeholder="Giro" 
                                    value={giro} 
                                    onChange={(e) => setGiro(e.target.value)}
                                    className="bg-white dark:bg-slate-700"
                                />
                                <Input 
                                    placeholder="Comuna" 
                                    value={comuna} 
                                    onChange={(e) => setComuna(e.target.value)}
                                    className="bg-white dark:bg-slate-700"
                                />
                                <Input 
                                    placeholder="Email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white dark:bg-slate-700"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subir Imagen */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Subir Imagen del Producto
                                </label>
                                <Button variant="outline" className="flex gap-2 hover:bg-blue-50 dark:hover:bg-blue-950">
                                    <UploadIcon size={16} />
                                    Elegir Archivo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agregar Productos */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                                <PlusIcon className="h-5 w-5 text-green-600" />
                                Agregar Productos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Seleccionar Producto
                                    </label>
                                    <Select onValueChange={setSelectedProductID} value={selectedProductID ?? undefined}>
                                        <SelectTrigger className="bg-white dark:bg-slate-700">
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
                                </div>

                                {selectedProductID && (
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            Seleccionar Talla
                                        </label>
                                        <Select onValueChange={handleAddProduct}>
                                            <SelectTrigger className="bg-white dark:bg-slate-700">
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
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detalle de Cotización */}
                    {selectedProducts.length > 0 && (
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                            <CardHeader>
                                <CardTitle className="text-slate-800 dark:text-white">Detalle de Cotización</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 dark:bg-slate-700">
                                                <TableHead className="font-semibold">Item</TableHead>
                                                <TableHead className="font-semibold">Talla</TableHead>
                                                <TableHead className="font-semibold">Cantidad</TableHead>
                                                <TableHead className="font-semibold">Precio Neto Unitario</TableHead>
                                                <TableHead className="font-semibold">Subtotal Neto</TableHead>
                                                <TableHead className="font-semibold"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedProducts.map((sp) => (
                                                <TableRow key={sp.variation.variationID} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                                    <TableCell className="font-medium">{sp.product.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{sp.variation.sizeNumber || "N/A"}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={sp.quantity}
                                                            onChange={(e) =>
                                                                handleQuantityChange(sp.variation.variationID, Number(e.target.value))
                                                            }
                                                            className="w-20 bg-white dark:bg-slate-700"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="flex items-center gap-1">
                                                        <DollarSignIcon className="h-4 w-4 text-green-600" />
                                                        {sp.variation.priceList}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-green-600">
                                                        ${(sp.quantity * Number(sp.variation.priceList || 0)).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveProduct(sp.variation.variationID)}
                                                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                                        >
                                                            <Trash2Icon size={16} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Descuentos / Cargos */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                                <PercentIcon className="h-5 w-5 text-orange-600" />
                                Descuentos / Cargos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                <div className="lg:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Descripción
                                    </label>
                                    <Input
                                        placeholder="Ej: descuento por volumen"
                                        value={discountDescription}
                                        onChange={(e) => setDiscountDescription(e.target.value)}
                                        className="bg-white dark:bg-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Tipo
                                    </label>
                                    <Select
                                        value={discountType}
                                        onValueChange={(value) => setDiscountType(value === "Descuento" ? "Descuento" : "Cargo")}
                                    >
                                        <SelectTrigger className="bg-white dark:bg-slate-700">
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Descuento">Descuento</SelectItem>
                                            <SelectItem value="Cargo">Cargo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Porcentaje
                                    </label>
                                    <div className="flex items-center gap-1">
                                        <Input
                                            placeholder="0-100"
                                            className="bg-white dark:bg-slate-700"
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={discountPercentage}
                                            onChange={(e) => setDiscountPercentage(e.target.value)}
                                        />
                                        <PercentIcon size={16} className="text-muted-foreground" />
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleAddDiscount}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Agregar
                                </Button>
                            </div>

                            {discounts.length > 0 && (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 dark:bg-slate-700">
                                                <TableHead className="font-semibold">Tipo</TableHead>
                                                <TableHead className="font-semibold">Descripción</TableHead>
                                                <TableHead className="font-semibold">Porcentaje</TableHead>
                                                <TableHead className="font-semibold"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {discounts.map((d) => (
                                                <TableRow key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                                    <TableCell>
                                                        <Badge 
                                                            variant={d.type === "Descuento" ? "default" : "destructive"}
                                                            className={d.type === "Descuento" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                                        >
                                                            {d.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{d.description}</TableCell>
                                                    <TableCell className="font-semibold">{d.percentage}%</TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleRemoveDiscount(d.id)}
                                                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                                        >
                                                            <Trash2Icon size={16} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

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

                    {/* Resumen Final */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Datos Bancarios */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                                    <BuildingIcon className="h-5 w-5 text-blue-600" />
                                    Datos de Transferencia Bancaria
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="bg-slate-50 dark:bg-slate-700 border">
                                        <CardContent className="p-4 space-y-2">
                                            <h4 className="font-bold text-blue-600">Banco Chile</h4>
                                            <div className="text-sm space-y-1">
                                                <p><span className="font-medium">Cta Cte:</span> 144 032 6403</p>
                                                <p><span className="font-medium">Razón Social:</span> D3SI SpA</p>
                                                <p><span className="font-medium">RUT:</span> 77.058.146-K</p>
                                                <p><span className="font-medium">Email:</span> alejandro.contreras@d3si.cl</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-slate-50 dark:bg-slate-700 border">
                                        <CardContent className="p-4 space-y-2">
                                            <h4 className="font-bold text-blue-600">Banco Estado</h4>
                                            <div className="text-sm space-y-1">
                                                <p><span className="font-medium">Cta Cte:</span> 629 0034 9276</p>
                                                <p><span className="font-medium">Razón Social:</span> D3SI SpA</p>
                                                <p><span className="font-medium">RUT:</span> 77.058.146-K</p>
                                                <p><span className="font-medium">Email:</span> alejandro.contreras@d3si.cl</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Resumen de Totales */}
                        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                                    <DollarSignIcon className="h-5 w-5 text-green-600" />
                                    Resumen Financiero
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                        <span className="text-slate-600 dark:text-slate-300">Monto Neto:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">${montoNeto.toFixed(2)}</span>
                                    </div>
                                    {totalDescuentos > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                            <span className="text-red-600">Descuentos:</span>
                                            <span className="font-semibold text-red-600">-${totalDescuentos.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totalCargos > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                            <span className="text-red-600">Descuentos:</span>
                                            <span className="font-semibold text-red-600">-${totalCargos.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                        <span className="text-slate-600 dark:text-slate-300">Subtotal:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                        <span className="text-slate-600 dark:text-slate-300">IVA (19%): </span>
                                        <span className="font-semibold text-slate-800 dark:text-white">${iva.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                                        <span className="text-slate-600 dark:text-slate-300">Monto Total:</span>
                                        <span className="font-bold text-slate-800 dark:text-white">${montoTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Botón Gener Cotizacion */}
                    <div className="text-center ">
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleGeneratePDF}>Generar Cotización</Button>
                    </div>
                </div>
            </div>        
        </div>
    )
}
