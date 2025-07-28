import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BuildingIcon, MailIcon, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { QuotesClient } from "@/components/Quotes/QuotesClient"

export default async function QuotesPage() {
    // Obtenemos los productos en el servidor
    const products = await getAllProducts()

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="min-h-screen">
                <div className="container mx-auto py-8 px-4 space-y-8">
                    {/* Header Card - Estático */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BuildingIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                                D3SI AVOCCO
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
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            >
                                                R.U.T.: 77.058.146-K
                                            </Badge>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-800 dark:text-white">
                                                    COTIZACIÓN ELECTRÓNICA
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Fecha de emisión estática */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span className="font-medium">Emisión:</span>
                                        <span>{format(new Date(), "dd/MM/yyyy")}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Datos Bancarios - Estático */}
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
                                            <p>
                                                <span className="font-medium">Cta Cte:</span> 144 032 6403
                                            </p>
                                            <p>
                                                <span className="font-medium">Razón Social:</span> D3SI SpA
                                            </p>
                                            <p>
                                                <span className="font-medium">RUT:</span> 77.058.146-K
                                            </p>
                                            <p>
                                                <span className="font-medium">Email:</span> alejandro.contreras@d3si.cl
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-50 dark:bg-slate-700 border">
                                    <CardContent className="p-4 space-y-2">
                                        <h4 className="font-bold text-blue-600">Banco Estado</h4>
                                        <div className="text-sm space-y-1">
                                            <p>
                                                <span className="font-medium">Cta Cte:</span> 629 0034 9276
                                            </p>
                                            <p>
                                                <span className="font-medium">Razón Social:</span> D3SI SpA
                                            </p>
                                            <p>
                                                <span className="font-medium">RUT:</span> 77.058.146-K
                                            </p>
                                            <p>
                                                <span className="font-medium">Email:</span> alejandro.contreras@d3si.cl
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Componente Cliente que maneja toda la lógica interactiva */}
                    <QuotesClient products={products} />
                </div>
            </div>
        </div>
    )
}
