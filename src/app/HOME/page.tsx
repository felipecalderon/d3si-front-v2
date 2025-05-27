import React from "react";
import { ArrowRightLeft, CreditCard, HandCoins, Wallet } from "lucide-react";

export default function HomePage() {
 return (
    <main className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
        <div className="mb-6">
          <img src="/logo.png" alt="Logo" className="mb-4" />
          <p className="text-sm">¡Hola<br /><strong>Alejandro Contreras!</strong></p>
        </div>

        <select className="text-black mb-4 p-2 rounded">
          <option>Tiendas Principales</option>
          <option>Terceros</option>
        </select>

        <nav className="flex flex-col gap-2">
          {["Caja", "Inventario", "Facturas", "Cotizar", "Crear OC", "UTI", "Control de Mando", "Estado de Resultados"].map((item) => (
            <button
              key={item}
              className="bg-blue-700 hover:bg-blue-600 text-left px-4 py-2 rounded"
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="mt-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded">
          Cerrar Sesión
        </button>
      </aside>

      {/* Dashboard */}
      <section className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <img src="/logo-d3si.png" alt="D3SI AVACCO" className="h-10" />
          <div className="flex items-center gap-4">
            <p className="font-semibold text-orange-600">Alejandro Contreras</p>
            <img src="/user.jpg" alt="User" className="w-10 h-10 rounded-full" />
          </div>
        </header>

        {/* Tarjetas principales */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Boletas Emitidas</p>
            <p className="text-2xl font-bold">128</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Facturas Emitidas</p>
            <p className="text-2xl font-bold">31</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Facturación</p>
            <p className="text-2xl font-bold">$45.846.410</p>
          </div>
        </div>

        {/* Ventas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Ventas del día</p>
            <p className="text-xl font-bold text-green-600">$435.670</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Ventas de ayer</p>
            <p className="text-xl font-bold text-yellow-600">$635.800</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p>Ventas Semana móvil</p>
            <p className="text-xl font-bold text-red-600">$3.535.800</p>
          </div>
          <div className="bg-white p-4 shadow rounded flex flex-col items-center justify-center">
            <p>Meta del mes</p>
            <p className="text-xl font-bold text-blue-600">$60MM</p>
          </div>
        </div>

        {/* Totales por método */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 shadow rounded text-center">
            <ArrowRightLeft className="mx-auto mb-2" />
            <p>Débito</p>
            <p className="text-sm">152 Pares - $11.1MM</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <CreditCard className="mx-auto mb-2" />
            <p>Crédito</p>
            <p className="text-sm">40 Pares - $1.6MM</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <HandCoins className="mx-auto mb-2" />
            <p>Efectivo</p>
            <p className="text-sm">192 Pares - $12.7MM</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <Wallet className="mx-auto mb-2" />
            <p>Total Caja</p>
            <p className="text-lg font-bold">$435.670</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
            Vender 🛍️
          </button>
        </div>
      </section>
    </main>
  );
}