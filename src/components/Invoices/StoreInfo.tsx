import React from "react"
import { Store, MapPin, Phone } from "lucide-react"

interface Props {
    store?: {
        name?: string
        address?: string
        phone?: string
        email?: string
        city?: string
    }
}

const StoreInfo: React.FC<Props> = ({ store }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Información de la Tienda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                        <p className="font-medium">{store?.name || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                        <p className="font-medium">{store?.address || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                        <p className="font-medium">{store?.phone || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="w-4 h-4 text-orange-600 dark:text-orange-400 font-bold">@</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-medium">{store?.email || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="w-4 h-4 text-orange-600 dark:text-orange-400 font-bold">🏙️</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ciudad</p>
                        <p className="font-medium">{store?.city || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo
