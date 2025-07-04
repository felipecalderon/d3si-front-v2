"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { IStore } from "@/interfaces/stores/IStore"
import { IUser } from "@/interfaces/users/IUser"
import { useTienda } from "@/stores/tienda.store"
import { getAllStores } from "@/actions/stores/getAllStores"
import { updateStore } from "@/actions/stores/updateStore"
import { addUserStore } from "@/actions/stores/addUserStore"
import { removeUserFromStore } from "@/actions/stores/removeUserFromStore"
import ModalUserTienda from "../Modals/ModalUserTienda"
import {
    Store,
    User,
    Plus,
    Trash2,
    Save,
    X,
    Building,
    Phone,
    MapPin,
    Hash,
    Map,
    MapPinned,
    UserRoundCheck,
    AtSign,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getAllUsers } from "@/actions/users/getAllUsers"

interface GestionStoreFormProps {
    isOpen: boolean
    onClose: () => void
    tienda: IStore
}

export default function GestionStoreForm({ isOpen, onClose, tienda }: GestionStoreFormProps) {
    const { users, stores, setStores, setUsers } = useTienda()

    const [nombre, setNombre] = useState(tienda.name)
    const [rut, setRut] = useState(tienda.rut)
    const [location, setlocation] = useState(tienda.location)
    const [ciudad, setCiudad] = useState(tienda.city)
    const [address, setAddress] = useState(tienda.address)
    const [telefono, setTelefono] = useState(tienda.phone)
    const [role, setRole] = useState(tienda.role)
    const [roleSelected, setRoleSelected] = useState(role || "")
    const [email, setEmail] = useState(tienda.email)
    const [isAdminLocal, setIsAdminLocal] = useState<boolean>(role === "admin")
    const [gestoresAsignados, setGestoresAsignados] = useState(
        users.filter((user) => user.Stores?.some((s) => s.storeID === tienda.storeID)) || []
    )
    const [selectedUserId, setSelectedUserId] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Filtrar usuarios disponibles (que no estén ya asignados como gestores)
    const usuariosDisponibles = users.filter(
        (user) => !gestoresAsignados.some((gestor) => gestor.userID === user.userID)
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (
                !nombre.trim() ||
                !location.trim() ||
                !ciudad.trim() ||
                !address.trim() ||
                !telefono.trim() ||
                !roleSelected.trim() ||
                !email.trim()
            ) {
                toast.error("Por favor, completa todos los campos obligatorios.")
                return
            }
            console.log(isAdminLocal)
            try {
                await updateStore(
                    tienda.storeID,
                    nombre.trim(),
                    location.trim(),
                    ciudad.trim(),
                    address.trim(),
                    telefono.trim(),
                    roleSelected.trim(),
                    email.trim(),
                    isAdminLocal
                )
            } catch (error) {
                console.log(error)
            }
            toast.success("Tienda actualizada exitosamente")

            // Cargar y guardar usuarios y tiendas
            const [usuarios, tiendas] = await Promise.all([getAllUsers(), getAllStores()])

            setUsers(usuarios)
            setStores(tiendas)

            onClose()
        } catch (error) {
            toast.error("Error al actualizar tienda")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        setIsAdminLocal(role === "admin")
    }, [role])
    const handleAgregarGestor = async () => {
        if (!selectedUserId) return

        const usuario = users.find((u) => u.userID === selectedUserId)
        if (usuario) {
            try {
                await addUserStore(selectedUserId, tienda.storeID)
            } catch (error) {
                console.log(error)
            }
            setGestoresAsignados((prev) => [...prev, usuario])
            // console.log("userID: " + selectedUserId + "        tiendaID:" + tienda.storeID)
            setSelectedUserId("")
        }
    }

    const rolTraducido = (rol: string) => {
        switch (rol) {
            case "admin":
                return "Admin"
            case "store_manager":
                return "Store Manager"
            case "consignado":
                return "Consignado"
            case "tercero":
                return "Tercero"
            default:
                return "Selecciona tipo"
        }
    }

    const handleEliminarGestor = async (userId: string) => {
        if (userId) {
            try {
                await removeUserFromStore(userId, tienda.storeID)
            } catch (error) {
                console.log(error)
            }
            setGestoresAsignados((prev) => prev.filter((gestor) => gestor.userID !== userId))
        }
    }

    const validateForm = () => {
        return nombre.trim() !== "" && location.trim() !== "" && ciudad.trim() !== "" && telefono.trim() !== ""
    }

    return (
        <ModalUserTienda isOpen={isOpen} onClose={onClose} title="Gestionar Tienda" maxWidth="max-w-4xl">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
                        <Building className="w-5 h-5" />
                        <span>Información de la Tienda</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Store className="w-4 h-4" />
                                Nombre *
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre de la tienda"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Hash className="w-4 h-4" />
                                Rut
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={rut}
                                placeholder="Nombre de la tienda"
                                disabled
                                className="bg-slate-100E dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Map className="w-4 h-4" />
                                location *
                            </Label>
                            <Input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setlocation(e.target.value)}
                                placeholder="location de la tienda"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <MapPinned className="w-4 h-4" />
                                Ciudad *
                            </Label>
                            <Input
                                id="ciudad"
                                type="text"
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                placeholder="Ciudad"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                direccion *
                            </Label>
                            <Input
                                id="location"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="direccion de tienda"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                Teléfono *
                            </Label>
                            <Input
                                id="telefono"
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Teléfono"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="text-sm flex font-medium text-gray-700 dark:text-white mb-1"
                            >
                                <UserRoundCheck className="w-4 h-4 mr-1" />
                                Tipo de rol
                            </label>
                            <Select value={roleSelected} onValueChange={(value) => setRoleSelected(value)} required>
                                <SelectTrigger className="w-full bg-slate-100 dark:bg-slate-800 dark:border-sky-50 dark:border p-2 rounded-md text-sm text-slate-700 dark:text-white">
                                    <SelectValue placeholder={rolTraducido(role)} />
                                </SelectTrigger>

                                <SelectContent className="dark:bg-gray-800 p-2 rounded-md bg-slate-300">
                                    <SelectItem value={role} disabled className="opacity-50 cursor-not-allowed">
                                        {rolTraducido(role)}
                                    </SelectItem>
                                    {["admin", "store_manager", "consignado", "tercero"]
                                        .filter((r) => r !== role)
                                        .map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {rolTraducido(r)}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                                <AtSign className="w-4 h-4" />
                                Email *
                            </Label>
                            <Input
                                id="telefono"
                                type="tel"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="bg-slate-100 dark:border-sky-50 dark:bg-slate-800"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-white mb-1 block">
                                ¿Es administrador?
                            </label>

                            <RadioGroup
                                value={isAdminLocal ? "yes" : "no"}
                                onValueChange={(value) => setIsAdminLocal(value === "yes")}
                                className="flex gap-4 mt-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="r1" />
                                    <label htmlFor="r1" className="text-sm text-gray-700 dark:text-white">
                                        Sí
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="r2" />
                                    <label htmlFor="r2" className="text-sm text-gray-700 dark:text-white">
                                        No
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                {/* Gestión de gestores */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
                        <User className="w-5 h-5" />
                        <span>Gestores Asignados</span>
                    </div>

                    {/* Agregar nuevo gestor */}
                    <div className="flex space-x-3">
                        <Select
                            value={selectedUserId}
                            onValueChange={(value) => setSelectedUserId(value)}
                            disabled={usuariosDisponibles.length === 0}
                        >
                            <SelectTrigger
                                title="Gestor"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100 dark:bg-slate-800 text-sm mb-4 transition-all"
                            >
                                <SelectValue
                                    placeholder={
                                        usuariosDisponibles.length === 0
                                            ? "No hay usuarios disponibles"
                                            : "Seleccionar gestor"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="bg-slate-100 dark:bg-slate-800">
                                {usuariosDisponibles.map((user) => (
                                    <SelectItem
                                        key={user.userID}
                                        value={user.userID}
                                        className="dark:bg-slate-800 data-[highlighted]:bg-gray-700"
                                    >
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            onClick={handleAgregarGestor}
                            disabled={!selectedUserId}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Agregar</span>
                        </Button>
                    </div>

                    {/* Lista de gestores asignados */}
                    <div className="space-y-2">
                        {gestoresAsignados.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:bg-slate-700 bg-gray-50 rounded-md">
                                <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                <p>No hay gestores asignados</p>
                            </div>
                        ) : (
                            gestoresAsignados.map((gestor, index) => (
                                <motion.div
                                    key={gestor.userID}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 dark:bg-slate-700 bg-green-50 border border-green-200 rounded-md"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">{gestor.name}</span>
                                            <p className="text-sm text-gray-500">{gestor.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => handleEliminarGestor(gestor.userID)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
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
        </ModalUserTienda>
    )
}
