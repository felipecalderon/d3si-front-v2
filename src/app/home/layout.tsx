import Navbar from "@/components/Navbar/Navbar"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Suspense } from "react"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen dark:bg-gray-900 bg-gray-100">
            <Suspense fallback={"...cargando"}>
                <Sidebar />
            </Suspense>
            <section className="flex-1 pl-2 lg:p-6 overflow-auto">
                <Navbar />
                {children}
            </section>
        </div>
    )
}
