"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon } from "lucide-react"

interface ClientData {
    rut: string
    razonSocial: string
    giro: string
    comuna: string
    email: string
    telefono: string
}

interface ClientDataFormProps {
    clientData: ClientData
    onClientDataChange: (data: ClientData) => void
}

export function ClientDataForm({ clientData, onClientDataChange }: ClientDataFormProps) {
    const handleInputChange = (field: keyof ClientData, value: string) => {
        onClientDataChange({
            ...clientData,
            [field]: value,
        })
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <FileTextIcon className="h-5 w-5 text-blue-600" />
                    Datos del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        placeholder="RUT"
                        value={clientData.rut}
                        onChange={(e) => handleInputChange("rut", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                    <Input
                        placeholder="Razón Social"
                        value={clientData.razonSocial}
                        onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                    <Input
                        placeholder="Giro"
                        value={clientData.giro}
                        onChange={(e) => handleInputChange("giro", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                    <Input
                        placeholder="Comuna"
                        value={clientData.comuna}
                        onChange={(e) => handleInputChange("comuna", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                    <Input
                        placeholder="Email"
                        value={clientData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                    <Input
                        placeholder="Teléfono"
                        value={clientData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        className="bg-white dark:bg-slate-700"
                    />
                </div>
            </CardContent>
        </Card>
    )
}