import RegistroForm from "@/components/Usuarios/Forms/RegistroForm"
import TiendasForm from "@/components/Usuarios/Forms/TiendasForm"
import ListTable from "@/components/Usuarios/Tables/ListTable"
import React from "react"

export default function UsuariosPage() {
    return (
        <div className=" flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold dark:text-white text-gray-900">Gestión de Usuarios</h1>
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
                <ListTable />
            </div>
        </div>
    )
}
