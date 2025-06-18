"use client"

import React, { useState } from "react"
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
import { Store, User, Plus, Trash2, Save, X, Building, Phone, MapPin, Hash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { Label } from "recharts"
import { Input } from "../ui/input"

interface GestionStoreFormProps {
  isOpen: boolean
  onClose: () => void
  tienda: IStore
}

export default function GestionStoreForm({ isOpen, onClose, tienda }: GestionStoreFormProps) {
  const { users, stores, setStores } = useTienda()
  
  const [nombre, setNombre] = useState(tienda.name)
  const [rut, setRut] = useState(tienda.rut)
  const [ciudad, setCiudad] = useState(tienda.city)
  const [telefono, setTelefono] = useState(tienda.phone)
  const [gestoresAsignados, setGestoresAsignados] = useState(
    users.filter(user => user.Stores?.some(s => s.storeID === tienda.storeID)) || []
  )
  const [selectedUserId, setSelectedUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Filtrar usuarios disponibles (que no estén ya asignados como gestores)
  const usuariosDisponibles = users.filter(user => 
    !gestoresAsignados.some(gestor => gestor.userID === user.userID)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log(tienda)
    try {
      // Actualizar datos básicos de la tienda si cambiaron
    //   if (nombre !== tienda.name || rut !== tienda.rut || ciudad !== tienda.city || telefono !== tienda.phone) {
    //     await updateStore(tienda.storeID, {
    //       name: nombre,
    //       rut: rut,
    //       city: ciudad,
    //       phone: telefono
    //     })
    //   }

      // Aquí puedes agregar lógica para sincronizar gestores
      // Esta implementación es simplificada
      
      toast.success("Tienda actualizada exitosamente")
      
      // Actualizar la lista de tiendas
      const tiendas = await getAllStores()
      setStores(tiendas)
      
      onClose()
    } catch (error) {
      toast.error("Error al actualizar tienda")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgregarGestor = () => {
    if (!selectedUserId) return

    const usuario = users.find(u => u.userID === selectedUserId)
    if (usuario) {
      setGestoresAsignados(prev => [...prev, usuario])
      setSelectedUserId("")
    }
  }

  const handleEliminarGestor = (userId: string) => {
    setGestoresAsignados(prev => prev.filter(gestor => gestor.userID !== userId))
  }

  const validateForm = () => {
    return nombre.trim() !== "" && rut.trim() !== "" && ciudad.trim() !== "" && telefono.trim() !== ""
  }

  return (
    <ModalUserTienda
      isOpen={isOpen} 
      onClose={onClose} 
      title="Gestionar Tienda"
      maxWidth="max-w-4xl"
    >
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
                    RUT *
                    </Label>
                    <Input
                    id="rut"
                    type="text"
                    value={rut}
                    disabled
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="RUT de la tienda"
                    required
                    className="bg-slate-100  dark:bg-slate-800"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
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
                    <SelectValue placeholder={
                    usuariosDisponibles.length === 0
                        ? "No hay usuarios disponibles"
                        : "Seleccionar gestor"
                    } />
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
