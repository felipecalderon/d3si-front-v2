import React from "react";
import { ArrowRightLeft, CreditCard, HandCoins, Wallet, FileText, FileCheck2, DollarSign } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import GaugeChart from "@/components/dashboard/GaugeChart";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

export default function HomePage() {
 return (
    <main className="flex h-screen bg-gray-100">
    <Sidebar />
    <section className="flex-1 p-6 overflow-auto">
        <Navbar />

<div className="grid grid-cols-3 gap-6 items-start">
  {/* Columna izquierda: Tarjetas principales */}
  <div className="flex flex-col gap-4">
    <StatCard icon={<FileText />} label="Boletas Emitidas" value="128" />
    <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value="31" />
    <StatCard icon={<DollarSign />} label="Facturación" value="$45.846.410" />
  </div>

{/* Columna centro: Gráfica */}
<div className="flex justify-center items-center h-full">
  <div className="w-full max-w-sm mx-auto">
    <GaugeChart />
  </div>
</div>



  {/* Columna derecha: Tarjetas de ventas */}
  <div className="flex flex-col gap-4">
    <StatCard icon={<DollarSign />} label="Ventas del día" value="$435.670" color="text-green-600" />
    <StatCard icon={<DollarSign />} label="Ventas de ayer" value="$635.800" color="text-yellow-600" />
    <StatCard icon={<DollarSign />} label="Ventas Semana móvil" value="$3.535.800" color="text-red-600" />
  </div>
</div>


        {/* Totales por método */}
        <div className="grid grid-cols-4 gap-4 mb-4 mt-5">
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