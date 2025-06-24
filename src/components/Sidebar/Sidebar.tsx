"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTienda } from "@/stores/tienda.store"
import { getAllStores } from "@/actions/stores/getAllStores"
import { Collapsible } from "@/components/Animations/Collapsible"
import { SidebarTransition } from "@/components/Animations/SidebarTransition"
import { Switch } from "../ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { navItems } from "@/utils/navItems"
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"

export default function Sidebar() {
    const router = useRouter()
    const { stores, setStores } = useTienda()
    const [storeSelected, setStoreSelected] = useState<{ storeID: string; name: string } | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

    // Theme toggle handler
    const handleThemeToggle = (checked: boolean) => {
        setIsDarkMode(checked)
        document.documentElement.classList.toggle("dark", checked)
    }

    // Load stores on mount
    useEffect(() => {
        const cargarTiendas = async () => {
            try {
                const tiendas = await getAllStores()
                setStores(tiendas)
                if (tiendas.length > 0) {
                    setStoreSelected({ storeID: tiendas[0].storeID, name: tiendas[0].name })
                }
            } catch (error) {
                console.error("Error loading data:", error)
            }
        }
        cargarTiendas()
    }, [setStores])

    const toggleSection = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }))
    }

    return (
        <SidebarTransition isCollapsed={isCollapsed}>
            <div className="flex flex-col h-screen bg-slate-200 shadow-lg shadow-black dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    {!isCollapsed && (
                        <div className="relative w-[200px] h-[120px]">
                            <Image
                                src="/brand/two-brands-color.png"
                                alt="Logo Light"
                                fill
                                className="block dark:hidden object-contain"
                            />
                            <Image
                                src="/brand/two-brands.png"
                                alt="Logo Dark"
                                fill
                                className="hidden dark:block object-contain"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
                    </button>
                </div>

                {/* Store Selector */}
                {!isCollapsed && (
                    <Select
                        value={storeSelected?.storeID || ""}
                        onValueChange={(value) => {
                            const tienda = stores.find((t) => t.storeID === value)
                            if (tienda) setStoreSelected(tienda)
                        }}
                    >
                        <SelectTrigger
                            title="select"
                            className="dark:bg-gray-800 bg-slate-300 rounded-lg p-2 text-sm mb-4 focus:outline-none focus:ring-2 transition-all"
                        >
                            <SelectValue placeholder="Selecciona una tienda" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 bg-slate-300">
                            {stores.map((tienda) => (
                                <SelectItem
                                    key={tienda.storeID}
                                    value={tienda.storeID}
                                    className="dark:bg-gray-800 data-[highlighted]:bg-gray-700"
                                >
                                    {tienda.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => {
                        const sectionId = item.label.toLowerCase().replace(/\s+/g, "")
                        return (
                            <div key={item.label} className="space-y-1">
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleSection(sectionId)}
                                            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                                isCollapsed
                                                    ? "justify-center dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                    : "dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                            } group`}
                                        >
                                            <span className="text-lg">{<item.icon />}</span>
                                            {!isCollapsed && (
                                                <span className="ml-3 flex-1 text-left">{item.label}</span>
                                            )}
                                            {!isCollapsed && (
                                                <motion.span
                                                    animate={{ rotate: openSections[sectionId] ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    ▼
                                                </motion.span>
                                            )}
                                        </button>

                                        <Collapsible isOpen={openSections[sectionId]}>
                                            <div className="pl-6 space-y-1">
                                                {item.subItems?.map((sub) => (
                                                    <button
                                                        key={sub.label}
                                                        onClick={() => router.push(sub.route || "#")}
                                                        className="flex items-center p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white w-full text-left"
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </Collapsible>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => router.push(item.route || "#")}
                                        className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                            isCollapsed
                                                ? "justify-center dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                : "dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                        } group`}
                                    >
                                        <span className="text-lg">{<item.icon />}</span>
                                        {!isCollapsed && <span className="ml-3 flex-1 text-left">{item.label}</span>}
                                        {isCollapsed && (
                                            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.label}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </nav>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 border-t dark:border-gray-800 border-gray-400">
                    <div className="flex items-center">
                        {isDarkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
                        {!isCollapsed && <span className="ml-3">Theme</span>}
                    </div>
                    {!isCollapsed && (
                        <Switch
                            checked={isDarkMode}
                            onCheckedChange={handleThemeToggle}
                            className="bg-gray-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-900"
                        />
                    )}
                </div>
            </div>
        </SidebarTransition>
    )
}
