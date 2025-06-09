"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useState } from "react"
import { useTienda } from "@/stores/tienda.store"
import { getAllStores } from "@/actions/stores/getAllStores"
import { deleteStore } from "@/actions/stores/deleteStore"

export default function StoresTable() {
  const { setStores, stores, users } = useTienda()
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
    // console.log(stores);
    // console.log(users.find(user => user.Stores.map((store) => store.storeID == storeId)).name);
    
        
    // try {
    //     const data = await deleteStore(storeId)
                    
    //     if (data.error) {
    //     toast.error(data.error)
    //     } else {
    //     toast.success("tienda eliminado exitosamente")
    //     const [Stores] = await Promise.all([getAllStores()])
    //     setStores(Stores)
    //     setConfirmingId(null)
    //     }
    // } catch (error) {
    //     toast.error("Error al eliminar la tienda")
    //     console.error(error)
    // }
  }

  if (stores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-500">
          No hay tiendas registradas
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">NOMBRE</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">RUT</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">CIUDAD</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">TELÉFONO</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">GESTOR</TableHead>
            <TableHead className="font-medium text-gray-500 uppercase tracking-wider">ACCIÓN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => {
            let gestor = users.find(user => user.Stores.find((storeU) => storeU.storeID == store.storeID))
            return(
            <TableRow key={store.storeID} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-900">
                {store.name}
              </TableCell>
              <TableCell className="text-gray-600">
                {store.rut}
              </TableCell>
              <TableCell className="text-gray-600">
                {store.city}
              </TableCell>
              <TableCell className="text-gray-600">
                {store.phone}
              </TableCell>
              <TableCell className="text-blue-600">
                {gestor?.name || "Sin gestor"}
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
          )})}
        </TableBody>
      </Table>
    </div>
  )
}