import Navbar from "@/components/Navbar/Navbar"
import Sidebar from "@/components/Sidebar/Sidebar"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen dark:bg-gray-900 bg-gray-100">
            <Sidebar />
            <section className="flex-1 p-6 overflow-auto">
                <Navbar />
                {children}
            </section>
        </div>
    )
}
