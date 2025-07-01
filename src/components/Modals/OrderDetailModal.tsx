"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { 
    Calendar, 
    CreditCard, 
    MapPin, 
    Phone, 
    Receipt, 
    ShoppingBag, 
    Store, 
    Tag,
    Percent,
    Package
} from "lucide-react"

interface Props {
    open: boolean
    onClose: () => void
    order: IOrderWithStore | null
}

const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        'Completado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        'En proceso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

export default function OrderDetailModal({ open, onClose, order }: Props) {
    if (!order) return null

    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <div className="bg-white max-h-[90vh] overflow-y-auto dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-md p-4">
                    <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            Detalles de la Orden
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-6">
                        {/* Información Principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Folio</span>
                                </div>
                                <p className="text-lg font-semibold">{order.orderID}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha</span>
                                </div>
                                <p className="text-lg font-semibold">{fecha}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</span>
                                </div>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Información Financiera */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                                <CreditCard className="w-5 h-5" />
                                Resumen Financiero
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        ${parseFloat(order.total).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Tipo</p>
                                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        {order.type}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Percent className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                        <p className="text-sm text-blue-600 dark:text-blue-300">Descuento</p>
                                    </div>
                                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        ${parseFloat(order.discount || "0").toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Tienda */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                Información de la Tienda
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                        <p className="font-medium">{order.Store?.name || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                                        <p className="font-medium">{order.Store?.address || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                        <p className="font-medium">{order.Store?.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos ({order.ProductVariations?.length || 0})
                            </h3>
                            {order.ProductVariations && order.ProductVariations.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                                                    <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Talla</th>
                                                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                                                    <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Precio Unit.</th>
                                                    <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.ProductVariations.map((item, index) => (
                                                    <tr 
                                                        key={item.variationID} 
                                                        className={`border-b border-gray-100 dark:border-gray-700 ${
                                                            index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700/50' : ''
                                                        }`}
                                                    >
                                                        <td className="py-3 px-2">
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                                {item.sku}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                                {item.sizeNumber}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-2 text-center">
                                                            <span className="font-semibold">{item.quantityOrdered}</span>
                                                        </td>
                                                        <td className="py-3 px-2 text-right font-medium">
                                                            ${parseFloat(item.priceList).toFixed(2)}
                                                        </td>
                                                        <td className="py-3 px-2 text-right font-bold text-green-600 dark:text-green-400">
                                                            ${item.subtotal.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {order.ProductVariations.map((item) => (
                                            <div 
                                                key={item.variationID} 
                                                className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs font-mono">
                                                        {item.sku}
                                                    </span>
                                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                        Talla {item.sizeNumber}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Cantidad</p>
                                                        <p className="font-semibold">{item.quantityOrdered}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Precio Unit.</p>
                                                        <p className="font-medium">${parseFloat(item.priceList).toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                                                        <p className="font-bold text-green-600 dark:text-green-400">
                                                            ${item.subtotal.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No hay productos en esta orden.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}