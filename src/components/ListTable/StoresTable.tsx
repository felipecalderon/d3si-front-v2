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
// import { deleteStore, getAllStores } from "@/lib/api"
// import { toast } from "sonner"

export default function StoresTable() {
  const { stores, users, setStores } = useTienda()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (storeId: string) => {
    setEditingId(storeId)
    setConfirmingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDelete = async (storeId: string) => {
    // Ejemplo de implementación para más adelante
    /*
    try {
      const data = await deleteStore(storeId)

      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success("Tienda eliminada exitosamente")
        const updatedStores = await getAllStores()
        setStores(updatedStores)
        setConfirmingId(null)
      }
    } catch (error) {
      toast.error("Error al eliminar la tienda")
      console.error(error)
    }
    */
  }

  if (stores.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-500">No hay tiendas registradas</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-slate-700">
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Nombre</TableHead>
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">RUT</TableHead>
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Ciudad</TableHead>
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Teléfono</TableHead>
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Gestor</TableHead>
            <TableHead className="uppercase text-gray-500 font-medium tracking-wider">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => {
            const gestor = users.find((user) =>
              user.Stores.some((s) => s.storeID === store.storeID)
            )

            return (
              <TableRow key={store.storeID} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900 dark:text-white">{store.name}</TableCell>
                <TableCell className="text-gray-600 dark:text-white">{store.rut}</TableCell>
                <TableCell className="text-gray-600 dark:text-white">{store.city}</TableCell>
                <TableCell className="text-gray-600 dark:text-white">{store.phone}</TableCell>
                <TableCell className="text-blue-600">{gestor?.name || "Sin gestor"}</TableCell>
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
                          onClick={() => handleEdit(store.storeID)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => setConfirmingId(store.storeID)}
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
                        >
                          Eliminar
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
  )
}
