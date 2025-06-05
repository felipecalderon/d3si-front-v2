import RegistroForm from '@/components/Forms/RegistroForm'
import TiendasForm from '@/components/Forms/TiendasForm'
import Sidebar from '@/components/Sidebar/Sidebar'
import UsuariosList from '@/components/Usuario/UsuariosList'
import React from 'react'

export default function UsuariosPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className=" flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">Administra usuarios y tiendas del sistema</p>
            </div>

            {/* Grid de formularios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Formulario de Registro */}
            <div>
                <RegistroForm />
            </div>

            {/* Formulario de Tiendas */}
            <div>
                <TiendasForm />
            </div>
            </div>

            {/* Lista de Usuarios */}
            <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuarios Registrados</h2>
            <UsuariosList />
            </div>
        </div>
    </div>
  )
}