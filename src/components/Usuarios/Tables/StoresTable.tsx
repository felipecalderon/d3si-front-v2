"use client"

import { useState } from "react"
import { useTienda } from "@/stores/tienda.store"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import GestionStoreForm from "../Edit/GestionStoreForm"
import { IStore } from "@/interfaces/stores/IStore"
import { Edit, Trash2, Store as StoreIcon } from "lucide-react"
import { deleteStore } from "@/actions/stores/deleteStore"
import { getAllStores } from "@/actions/stores/getAllStores"
import { useAuth } from "@/stores/user.store"

export default function StoresTable() {
    const { stores, setStores } = useTienda()
    const { users } = useAuth()
    const [confirmingId, setConfirmingId] = useState<string | null>(null)
    const [editingStore, setEditingStore] = useState<IStore | null>(null)

    const handleEdit = (store: IStore) => {
        setEditingStore(store)
        setConfirmingId(null)
    }

    const handleCloseModal = () => {
        setEditingStore(null)
    }
    const handleDelete = async (storeId: string) => {
        try {
            await deleteStore(storeId)
            // Cargar y guardar usuarios y tiendas
            const tiendas = await getAllStores()
            setStores(tiendas)
        } catch (error) {
            console.error(error)
        }
    }

    if (stores.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                <div className="text-center text-gray-500 py-8">
                    <StoreIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p>No hay tiendas registradas</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-700">
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Nombre</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">RUT</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Ciudad</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">
                                Teléfono
                            </TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Gestor</TableHead>
                            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stores.map((store) => {
                            const gestores = users.filter((user) =>
                                user.Stores.some((s) => s.storeID === store.storeID)
                            )

                            return (
                                <TableRow key={store.storeID} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <TableCell className="font-medium text-gray-900 dark:text-white">
                                        {store.name}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-white">{store.rut}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-white">{store.city}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-white">{store.phone}</TableCell>
                                    <TableCell className="text-blue-600">
                                        {gestores.length > 0 ? gestores.map((g) => g.name).join(", ") : "Sin gestor"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {confirmingId === store.storeID ? (
                                                <>
                                                    <Button
                                                        onClick={() => handleDelete(store.storeID)}
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
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        onClick={() => handleEdit(store)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded flex items-center space-x-1"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                        <span>Editar</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => setConfirmingId(store.storeID)}
                                                        variant="destructive"
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded flex items-center space-x-1"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        <span>Eliminar</span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de edición */}
            {editingStore && (
                <GestionStoreForm isOpen={!!editingStore} onClose={handleCloseModal} tienda={editingStore} />
            )}
        </>
    )
}
