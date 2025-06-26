# D3SI Front (v2)

![D3SI](public/brand/two-brands-color.png)

D3SI app es la interfaz de usuario para el sistema de gestión de inventario y ventas D3SI. Esta aplicación web moderna, construida con Next.js y TypeScript, proporciona una plataforma robusta y eficiente para la administración de tiendas, productos, usuarios y transacciones.

## ✨ Características Principales

-   **Gestión de Inventario:** Creación masiva y edición de productos, control de stock y variaciones.
-   **Punto de Venta (POS):** Interfaz rápida para realizar ventas, escanear productos y gestionar carritos de compra.
-   **Administración de Tiendas:** Creación y gestión de múltiples sucursales o almacenes.
-   **Control de Usuarios:** Asignación de roles y permisos para distintos usuarios dentro de las tiendas.
-   **Dashboard Analítico:** Visualización de métricas clave como ventas totales, rendimiento por canal y más.
-   **Generación de Reportes:** Exportación de datos de inventario a formato Excel.
-   **Diseño Responsivo:** Interfaz optimizada para funcionar en distintos dispositivos.

## 🚀 Stack Tecnológico

-   **Framework:** [Next.js](https://nextjs.org/) (con App Router)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) y componentes personalizados.
-   **Manejo de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Peticiones a API:** Server Actions de Next.js con `fetch`.
-   **Visualización de Datos:** [Recharts](https://recharts.org/)
-   **Linting y Formateo:** [ESLint](https://eslint.org/) y [Prettier](https://prettier.io/)

## 🏁 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### Prerrequisitos

-   [Node.js](https://nodejs.org/en/) (versión 20.x o superior)
-   [pnpm](https://pnpm.io/installation) como gestor de paquetes

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/d3si-front-v2.git
    cd d3si-front-v2
    ```

2.  **Instala las dependencias:**

    ```bash
    pnpm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade la siguiente variable. Por defecto, se conectará al backend de producción si no se especifica.

    ```env
    NEXT_PUBLIC_API_URL=https://desi-back-cloned-production.up.railway.app
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    pnpm dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## 📜 Scripts Disponibles (puedes usar PNPM o NPM)

-   `pnpm dev`: Inicia la aplicación en modo de desarrollo.
-   `pnpm build`: Compila la aplicación para producción.
-   `pnpm start`: Inicia un servidor de producción.
-   `pnpm lint`: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.

## 📂 Estructura del Proyecto

El proyecto sigue una organización por dominios (feature-based), lo que facilita la escalabilidad y el mantenimiento.

```
d3si-front-v2/
├── src/
│   ├── actions/        # Server Actions (lógica de backend)
│   ├── app/            # Rutas de la aplicación (App Router)
│   ├── components/     # Componentes de React
│   │   ├── ui/         # Componentes de UI genéricos (Button, Card, etc.)
│   │   └── ...         # Componentes específicos de cada feature
│   ├── hooks/          # Hooks de React personalizados
│   ├── interfaces/     # Definiciones de tipos y modelos de datos
│   ├── lib/            # Funciones auxiliares y configuración (fetcher, envs)
│   ├── stores/         # Stores de Zustand para manejo de estado global
│   └── utils/          # Utilidades generales
├── public/             # Archivos estáticos (imágenes, fuentes)
├── .eslintrc.mjs       # Configuración de ESLint
├── next.config.ts      # Configuración de Next.js
└── tailwind.config.ts  # Configuración de Tailwind CSS
```

## 🎨 Calidad de Código y Convenciones

-   **ESLint y Prettier:** El proyecto está configurado para forzar un estilo de código consistente y detectar errores potenciales de forma automática.
-   **Server Actions:** La comunicación con el backend se realiza a través de Server Actions de Next.js, centralizadas en la carpeta `src/actions`. Esto mejora la seguridad y simplifica la gestión de datos.
-   **Tipado Estricto:** Se utiliza TypeScript en todo el proyecto para garantizar la seguridad de tipos y mejorar la experiencia de desarrollo.
-   **Componentes Atómicos:** Se favorece el uso de componentes pequeños y reutilizables, especialmente en la carpeta `src/components/ui`.
