"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Trash2, Receipt } from "lucide-react"
import GestionGastosForm from "../Edit/GestionGastosForm"

import { useRouter } from "next/navigation"

interface Gasto {
    id: string
    nombre: string
    fechaFactura: string
    fechaPago: string
    monto: number
}

export default function GastosTable() {
    // Gastos estáticos iniciales
    const gastosIniciales: Gasto[] = [
        {
            id: "1",
            nombre: "Servicios Básicos - Electricidad",
            fechaFactura: "2025-01-15",
            fechaPago: "2025-02-15",
            monto: 85000,
        },
        {
            id: "2",
            nombre: "Arriendo Local Comercial",
            fechaFactura: "2025-01-01",
            fechaPago: "2025-02-01",
            monto: 450000,
        },
        {
            id: "3",
            nombre: "Internet y Telefonía",
            fechaFactura: "2025-01-10",
            fechaPago: "2025-02-10",
            monto: 35000,
        },
        {
            id: "4",
            nombre: "Mantención Equipos",
            fechaFactura: "2025-01-20",
            fechaPago: "2025-02-20",
            monto: 120000,
        },
        {
            id: "5",
            nombre: "Suministros de Oficina",
            fechaFactura: "2025-01-25",
            fechaPago: "2025-02-25",
            monto: 45000,
        },
    ]

    const [gastos, setGastos] = useState<Gasto[]>(gastosIniciales)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmingId, setConfirmingId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const router = useRouter()

    // Filtrar gastos por término de búsqueda
    const gastosFiltrados = gastos.filter((gasto) => gasto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleAgregarGasto = (nuevoGasto: Omit<Gasto, "id">) => {
        const gastoConId: Gasto = {
            ...nuevoGasto,
            id: Date.now().toString(),
        }
        setGastos((prev) => [...prev, gastoConId])
        setIsModalOpen(false)
    }

    const handleEliminarGasto = (gastoId: string) => {
        setGastos((prev) => prev.filter((gasto) => gasto.id !== gastoId))
        setConfirmingId(null)
    }

    const formatearMonto = (monto: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(monto)
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    if (gastosFiltrados.length === 0 && searchTerm) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                {/* Header con búsqueda y botón agregar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Buscar gastos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-100 dark:bg-slate-700"
                        />
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Gasto</span>
                    </Button>
                </div>

                <div className="text-center text-gray-500 py-12">
                    <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No se encontraron gastos con el término: {searchTerm}</p>
                    <Button onClick={() => setSearchTerm("")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Mostrar todos los gastos
                    </Button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <GestionGastosForm
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleAgregarGasto}
                    />
                )}
            </div>
        )
    }

    if (gastos.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <div className="text-center text-gray-500 py-8">
                    <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No hay gastos registrados</p>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Primer Gasto</span>
                    </Button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <GestionGastosForm
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleAgregarGasto}
                    />
                )}
            </div>
        )
    }

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                {/* Botón para generar estado de resultados */}
                <div className="flex justify-end p-4">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                        onClick={() => router.push("/home/incomeStatement")}
                    >
                        <span>Generar estado de resultados</span>
                    </Button>
                </div>
                {/* Header con búsqueda y botón agregar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Buscar gastos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-100 dark:bg-slate-700"
                        />
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Gasto</span>
                    </Button>
                </div>

                {/* Tabla */}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-700">
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Nombre</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">
                                Fecha Factura
                            </TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">
                                Fecha Pago
                            </TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Monto</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gastosFiltrados.map((gasto) => (
                            <TableRow key={gasto.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <TableCell className="font-medium text-gray-900 dark:text-white">
                                    {gasto.nombre}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-white">
                                    {formatearFecha(gasto.fechaFactura)}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-white">
                                    {formatearFecha(gasto.fechaPago)}
                                </TableCell>
                                <TableCell className="text-green-600 font-semibold">
                                    {formatearMonto(gasto.monto)}
                                </TableCell>
                                <TableCell>
                                    {confirmingId === gasto.id ? (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleEliminarGasto(gasto.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
                                            >
                                                Confirmar
                                            </Button>
                                            <Button
                                                onClick={() => setConfirmingId(null)}
                                                className="bg-gray-200 text-gray-800 px-3 py-1 text-xs rounded hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setConfirmingId(gasto.id)}
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded flex items-center space-x-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Eliminar</span>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <GestionGastosForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAgregarGasto}
                />
            )}
        </>
    )
}
