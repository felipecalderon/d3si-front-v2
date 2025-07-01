import {
    FaHome,
    FaBox,
    FaFileInvoice,
    FaCalculator,
    FaPlusCircle,
    FaUsers,
    FaChartLine,
    FaChartBar,
} from "react-icons/fa"

export const navItems = [
    {
        label: "Caja",
        route: "/home",
        icon: FaHome,
    },
    {
        label: "Inventario",
        route: "/home/inventory",
        icon: FaBox,
    },
    {
        label: "Facturación",
        icon: FaFileInvoice,
        subItems: [
            { label: "Crear OC", route: "/home/purchaseOrder" },
            { label: "Facturas", route: "/home/invoices" },
            { label: "Cotizar", route: "/home/quotes" },
        ],
    },
    {
        label: "UTI",
        route: "/home/usuarios",
        icon: FaUsers,
    },
    {
        label: "Control de Mando",
        route: "/home/controlDeMando",
        icon: FaChartLine,
    },
    {
        label: "Estado de Resultados",
        icon: FaChartBar,
    },
]
