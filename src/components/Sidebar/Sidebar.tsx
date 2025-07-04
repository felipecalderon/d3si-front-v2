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
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)

            // Only auto-collapse on desktop, not mobile
            if (!mobile) {
                setIsMobileOpen(false)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

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

    const handleNavClick = (route: string) => {
        router.push(route)
        // Close mobile menu after navigation
        if (isMobile) {
            setIsMobileOpen(false)
        }
    }

    // Determine if sidebar should show collapsed content
    // On mobile: never collapsed when open, always show full content
    // On desktop: use isCollapsed state
    const shouldShowCollapsed = !isMobile && isCollapsed

    // Mobile overlay
    const MobileOverlay = () => (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
                isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileOpen(false)}
        />
    )

    // Mobile menu button
    const MobileMenuButton = () => (
        <button
            onClick={() => setIsMobileOpen(true)}
            className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border"
        >
            <FaBars size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
    )

    return (
        <>
            <MobileMenuButton />
            <MobileOverlay />

            <div
                className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
                <SidebarTransition isCollapsed={shouldShowCollapsed}>
                    <div className="flex flex-col h-screen bg-slate-200 shadow-lg shadow-black dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                        {/* Header */}
                        <div className="flex justify-between items-center p-3 lg:p-4">
                            {!shouldShowCollapsed && (
                                <div className="relative w-[160px] lg:w-[200px] h-[80px] lg:h-[120px]">
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

                            <div className="flex items-center gap-2">
                                {/* Mobile close button */}
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="lg:hidden p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white transition-colors"
                                >
                                    <FaTimes size={18} />
                                </button>

                                {/* Desktop collapse button */}
                                <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="hidden lg:block p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white transition-colors"
                                >
                                    {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Store Selector */}
                        {!shouldShowCollapsed && (
                            <div className="px-3 lg:px-4 mb-4">
                                <Select
                                    value={storeSelected?.storeID || ""}
                                    onValueChange={(value) => {
                                        const tienda = stores.find((t) => t.storeID === value)
                                        if (tienda) setStoreSelected(tienda)
                                    }}
                                >
                                    <SelectTrigger
                                        title="select"
                                        className="dark:bg-gray-800 bg-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 transition-all w-full"
                                    >
                                        <SelectValue placeholder="Selecciona una tienda" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-800 bg-slate-300 z-50">
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
                            </div>
                        )}

                        {/* Navigation */}
                        <nav className="flex-1 px-2 py-2 lg:py-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => {
                                const sectionId = item.label.toLowerCase().replace(/\s+/g, "")
                                return (
                                    <div key={item.label} className="space-y-1">
                                        {item.subItems ? (
                                            <>
                                                <button
                                                    onClick={() => toggleSection(sectionId)}
                                                    className={`flex items-center w-full p-2 lg:p-3 rounded-lg transition-colors ${
                                                        shouldShowCollapsed
                                                            ? "justify-center dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                            : "dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                    } group`}
                                                >
                                                    <span className="text-lg flex-shrink-0">{<item.icon />}</span>
                                                    {!shouldShowCollapsed && (
                                                        <>
                                                            <span className="ml-3 flex-1 text-left text-sm lg:text-base truncate">
                                                                {item.label}
                                                            </span>
                                                            <motion.span
                                                                animate={{ rotate: openSections[sectionId] ? 180 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="flex-shrink-0"
                                                            >
                                                                ▼
                                                            </motion.span>
                                                        </>
                                                    )}
                                                    {/* Tooltip for collapsed desktop state */}
                                                    {shouldShowCollapsed && (
                                                        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </button>

                                                <Collapsible isOpen={openSections[sectionId] && !shouldShowCollapsed}>
                                                    <div className="pl-4 lg:pl-6 space-y-1">
                                                        {item.subItems?.map((sub) => (
                                                            <button
                                                                key={sub.label}
                                                                onClick={() => handleNavClick(sub.route || "#")}
                                                                className="flex items-center p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white w-full text-left text-sm"
                                                            >
                                                                <span className="truncate">{sub.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </Collapsible>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleNavClick(item.route || "#")}
                                                className={`flex items-center w-full p-2 lg:p-3 rounded-lg transition-colors ${
                                                    shouldShowCollapsed
                                                        ? "justify-center dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                        : "dark:hover:bg-gray-800 hover:bg-gray-600 hover:text-white"
                                                } group relative`}
                                            >
                                                <span className="text-lg flex-shrink-0">{<item.icon />}</span>
                                                {!shouldShowCollapsed && (
                                                    <span className="ml-3 flex-1 text-left text-sm lg:text-base truncate">
                                                        {item.label}
                                                    </span>
                                                )}
                                                {shouldShowCollapsed && (
                                                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
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
                        <div className="flex items-center justify-between p-3 lg:p-4 border-t dark:border-gray-800 border-gray-400">
                            <div className="flex items-center">
                                <span className="flex-shrink-0">
                                    {isDarkMode ? <FaMoon size={16} /> : <FaSun size={16} />}
                                </span>
                                {!shouldShowCollapsed && <span className="ml-3 text-sm lg:text-base">Theme</span>}
                            </div>
                            {!shouldShowCollapsed && (
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={handleThemeToggle}
                                    className="bg-gray-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-900 flex-shrink-0"
                                />
                            )}
                        </div>
                    </div>
                </SidebarTransition>
            </div>
        </>
    )
}
