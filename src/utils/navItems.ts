import { 
  FaHome, 
  FaBox, 
  FaFileInvoice, 
  FaCalculator, 
  FaPlusCircle, 
  FaUsers, 
  FaChartLine, 
  FaChartBar 
} from "react-icons/fa"

export const navItems = [
  { 
    label: "Caja", 
    route: "/home", 
    icon: FaHome 
  },
  { 
    label: "Inventario", 
    route: "/home/inventory", 
    icon: FaBox 
  },
  { 
    label: "Facturación", 
    icon: FaFileInvoice,
    subItems: [
      { label: "Crear OC", route: "/home/facturacion/crear-oc" },
      { label: "Cotizar", route: "/home/facturacion/cotizar" }
    ]
  },
  { 
    label: "UTI", 
    route: "/home/usuarios", 
    icon: FaUsers 
  },
  { 
    label: "Control de Mando", 
    route: "/home/controlDeMando", 
    icon: FaChartLine 
  },
  { 
    label: "Estado de Resultados", 
    icon: FaChartBar 
  }
]