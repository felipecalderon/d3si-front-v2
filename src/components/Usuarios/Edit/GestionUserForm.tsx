"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../ui/button"
import { toast } from "sonner"
import { IUser } from "@/interfaces/users/IUser"
import { IStore } from "@/interfaces/stores/IStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTienda } from "@/stores/tienda.store"
import { getAllUsers } from "@/actions/users/getAllUsers"
import { updateUser } from "@/actions/users/updateUser"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { addUserStore } from "@/actions/stores/addUserStore"
import { removeUserFromStore } from "@/actions/stores/removeUserFromStore"
import Modal from "./ModalUserTienda"
import { User, Store, Plus, Trash2, Save, X } from "lucide-react"
import { useAuth } from "@/stores/user.store"

interface GestionUserFormProps {
    isOpen: boolean
    onClose: () => void
    usuario: IUser
}

export default function GestionUserForm({ isOpen, onClose, usuario }: GestionUserFormProps) {
    const { stores, setStores } = useTienda()
    const { setUsers } = useAuth()

    // Estados para los campos del formulario
    const [nombre, setNombre] = useState(usuario.name)
    const [tiendAsignadas, setTiendasAsignadas] = useState(usuario.Stores || [])
    const [selectedStoreId, setselectedStoreId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    // Filtrar tiendas disponibles (que no estén ya asignadas)
    const tiendDisponibles = stores.filter(
        (store) => !tiendAsignadas.some((userStore) => userStore.storeID === store.storeID)
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Actualizar nombre si cambió
            if (nombre !== usuario.name) {
                await updateUser(nombre, usuario.email)
            }

            // Actualizar tiendas (aquí asumo que necesitarás implementar lógica para sincronizar)
            // Esta es una implementación simplificada

            toast.success("Usuario actualizado exitosamente")

            // Actualizar la lista de usuarios
            const usuarios = await getAllUsers()
            setUsers(usuarios)

            onClose()
        } catch (error) {
            toast.error("Error al actualizar usuario")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAgregarTienda = async () => {
        if (!selectedStoreId) return

        const tienda = stores.find((s) => s.storeID.toString() === selectedStoreId)
        if (tienda) {
            setTiendasAsignadas((prev) => [...prev, tienda])
            // Aquí llamamos la función async para agregar el store al user
            try {
                await addUserStore(usuario.userID.trim(), selectedStoreId.trim())
            } catch (error) {
                setTiendasAsignadas((prev) => prev.filter((t) => t.storeID !== selectedStoreId))
            }
        }
    }

    const handleEliminarTienda = async (storeId: string) => {
        if (storeId && usuario.userID) {
            try {
                await removeUserFromStore(usuario.userID, storeId)
                setTiendasAsignadas((prev) => prev.filter((tienda) => tienda.storeID !== storeId.toString()))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const validateForm = () => {
        return nombre.trim() !== ""
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gestionar Usuario" maxWidth="max-w-3xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
                        <User className="w-5 h-5" />
                        <span>Información del Usuario</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nombre" className="text-sm font-medium mb-2 dark:text-white">
                                Nombre *
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre del usuario"
                                required
                                className="dark:bg-slate-800 dark:border-sky-50"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm font-medium mb-2 dark:text-white">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={usuario.email}
                                disabled
                                className="bg-gray-50 text-gray-500 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Gestión de tiendas */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
                        <Store className="w-5 h-5" />
                        <span>Tiendas Asignadas</span>
                    </div>

                    {/* Agregar nueva tienda */}
                    <div className="flex space-x-3">
                        <Select
                            value={selectedStoreId}
                            onValueChange={(value) => setselectedStoreId(value)}
                            disabled={tiendDisponibles.length === 0}
                        >
                            <SelectTrigger className="flex-1 px-3 py-2 border border-gray-300 dark:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                <SelectValue
                                    placeholder={
                                        tiendDisponibles.length === 0
                                            ? "No hay tiendas disponibles"
                                            : "Seleccionar tienda"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="bg-white dark:bg-slate-800">
                                {tiendDisponibles.map((store) => (
                                    <SelectItem
                                        key={store.storeID}
                                        value={store.storeID.toString()}
                                        className="dark:bg-slate-800 data-[highlighted]:bg-gray-700"
                                    >
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            onClick={handleAgregarTienda}
                            disabled={!selectedStoreId}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Agregar</span>
                        </Button>
                    </div>

                    {/* Lista de tiendas asignadas */}
                    <div className="space-y-2">
                        {tiendAsignadas.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No hay tiendas asignadas</div>
                        ) : (
                            tiendAsignadas.map((store, index) => (
                                <motion.div
                                    key={store.storeID}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 dark:bg-slate-700  bg-blue-50 border border-blue-200 rounded-md"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Store className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <span className="font-medium dark:text-white text-gray-900">
                                                {store.name}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">({store.city})</span>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => handleEliminarTienda(store.storeID)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-gray-200 dark:bg-slate-700 dark:hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        type="submit"
                        disabled={!validateForm() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? "Guardando..." : "Guardar Cambios"}</span>
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
