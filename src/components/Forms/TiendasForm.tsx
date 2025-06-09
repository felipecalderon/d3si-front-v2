"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { IUser } from "@/interfaces/users/IUser"
import { useTienda } from "@/stores/tienda.store"
import { createStore } from "@/actions/stores/createStore"
import { getAllStores } from "@/actions/stores/getAllStores"

export default function TiendasForm() {
    const { users, setStores } = useTienda()

    const [rut, setRut] = useState("")
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [markup, setMarkup] = useState("")
    const [sucursal, setSucursal] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [direccion, setDireccion] = useState("")
    const [telefono, setTelefono] = useState("")
    const [tipoTienda, setTipoTienda] = useState("")
    const [gestorTienda, setGestorTienda] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const gestor = users.find((u: IUser) => u.name === gestorTienda)
        
        if (!gestor) {
            toast.error("Gestor no encontrado")
            return
        }
        
        try {
            let isAdmin = false
            if (tipoTienda === "admin") {
                isAdmin = true
            }
            await createStore(
                nombre,
                gestor.userID,
                sucursal,
                rut,
                telefono,
                direccion,
                ciudad,
                isAdmin
            )

            const allStores = await getAllStores()
            setStores(allStores)
            toast.success(`Tienda "${nombre}" creada exitosamente`)

            // Limpiar formulario
            setRut("")
            setNombre("")
            setEmail("")
            setMarkup("")
            setSucursal("")
            setCiudad("")
            setDireccion("")
            setTelefono("")
            setTipoTienda("")
            setGestorTienda("")
        } catch (error) {
            toast.error("Error al crear tienda")
            console.error(error)
        }
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Crear nueva Tienda</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Primera fila: RUT y Nombre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="rut">
                            RUT
                        </label>
                        <input
                            id="rut"
                            type="text"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="76.600.001-2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="La tiendita"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Segunda fila: Email y Markup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tiendita@gmail.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="markup">
                            Markup
                        </label>
                        <input
                            id="markup"
                            type="text"
                            value={markup}
                            onChange={(e) => setMarkup(e.target.value)}
                            placeholder="Ej: 1.8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Tercera fila: Sucursal y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="sucursal">
                            Sucursal o sector
                        </label>
                        <input
                            id="sucursal"
                            type="text"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            placeholder="Mall Portal Temuco"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="ciudad">
                            Ciudad
                        </label>
                        <input
                            id="ciudad"
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            placeholder="Temuco"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Cuarta fila: Dirección y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="direccion">
                            Dirección (calle y número)
                        </label>
                        <input
                            id="direccion"
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ej: Calle Nombre 111"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="telefono">
                            Teléfono
                        </label>
                        <input
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="9 8484 8686"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Quinta fila: Tipo de tienda y Gestor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="tipoTienda">
                            Tipo de tienda
                        </label>
                        <select
                            id="tipoTienda"
                            value={tipoTienda}
                            onChange={(e) => setTipoTienda(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="admin">Admin</option>
                            <option value="store_manager">Store Manager</option>
                            <option value="consignado">Consignado</option>
                            <option value="tercero">Tercero</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="gestorTienda">
                            Gestor de la tienda
                        </label>
                        <select
                            id="gestorTienda"
                            value={gestorTienda}
                            onChange={(e) => setGestorTienda(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Selecciona gestor</option>
                            {users.map((u: IUser) => (
                                <option key={u.userID} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botón de envío */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors font-medium"
                    >
                        Crear Tienda
                    </Button>
                </div>
            </form>
        </div>
    )
}