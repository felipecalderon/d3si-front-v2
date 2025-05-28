import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

export default function StatCard({ icon, label, value, color = "text-black" }: StatCardProps) {
  return (
    <div className="flex bg-white shadow rounded p-4 items-center">
      <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
