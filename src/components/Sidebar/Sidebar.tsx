"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTienda } from "@/stores/tienda.store"
import { Collapsible } from "@/components/Animations/Collapsible"
import { SidebarTransition } from "@/components/Animations/SidebarTransition"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { navItems } from "@/utils/navItems"
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import { MotionItem } from "../Animations/motionItem"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import useMobileScreen from "@/hooks/useMobileScreen"
import useDarkMode from "@/hooks/useDarkMode"

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { user } = useAuth()
    const { storeSelected } = useTienda()

    const { isMobile, isMobileOpen, setIsMobileOpen } = useMobileScreen()
    const { isDarkMode, setIsDarkMode } = useDarkMode()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

    const createQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        const storeID = searchParams.get("storeID")
        if (!storeID) {
            if (storeSelected) router.push(`${pathname}?${createQueryParam("storeID", storeSelected.storeID)}`)
        }
    }, [pathname, storeSelected])

    const toggleSection = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }))
    }

    const handleNavClick = async (route: string) => {
        router.push(route)
        // Close mobile menu after navigation
        if (isMobile) {
            setIsMobileOpen(false)
        }
    }

    const filteredNavItems = React.useMemo(() => {
        if (!user) return []
        if (user.role === Role.Vendedor) {
            return navItems.filter(
                (item) =>
                    item.label !== "UTI" && item.label !== "Estado de Resultados" && item.label !== "Control de Mando"
            )
        } else if (user.role === Role.Consignado) {
            return navItems.filter(
                (item) =>
                    item.label !== "Caja" &&
                    item.label !== "Inventario" &&
                    item.label !== "UTI" &&
                    item.label !== "Control de Mando" &&
                    item.label !== "Estado de Resultados"
            )
        } else if (user.role === Role.Tercero) {
            return navItems.filter((item) => item.label === "Inventario" || item.label === "Facturación")
        }
        return navItems
    }, [user])
    // Check if a section has active items
    const hasActiveSubItem = (subItems: any[]) => {
        return subItems?.some((sub) => pathname === sub.route)
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
            title="btn"
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
            <TooltipProvider>
                <div
                    className={`
                    fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                    transform transition-transform duration-300 ease-in-out lg:transform-none
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
                >
                    <SidebarTransition isCollapsed={shouldShowCollapsed}>
                        <div className="flex flex-col h-screen bg-slate-200 shadow-lg shadow-black dark:bg-gray-900 text-gray-600 dark:text-gray-300 overflow-visible">
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
                                        title="btn"
                                        onClick={() => setIsMobileOpen(false)}
                                        className="lg:hidden p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-sky-800 hover:text-white transition-colors"
                                    >
                                        <FaTimes size={18} />
                                    </button>

                                    {/* Desktop collapse button */}
                                    <button
                                        onClick={() => setIsCollapsed(!isCollapsed)}
                                        className="hidden lg:block p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-sky-800 hover:text-white transition-colors"
                                    >
                                        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-0 py-2 lg:py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                                {filteredNavItems.map((item, index) => {
                                    const sectionId = item.label.toLowerCase().replace(/\s+/g, "")
                                    const isActive = pathname === item.route
                                    const hasActiveChild = item.subItems && hasActiveSubItem(item.subItems)

                                    return (
                                        <div key={item.label} className="space-y-1">
                                            {item.subItems ? (
                                                <>
                                                    <MotionItem delay={index}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => toggleSection(sectionId)}
                                                                    className={`flex items-center w-full p-2 lg:p-3 transition-all duration-200 group relative
                                                                        ${
                                                                            shouldShowCollapsed
                                                                                ? "justify-center min-h-[40px]"
                                                                                : ""
                                                                        }
                                                                        ${
                                                                            hasActiveChild
                                                                                ? shouldShowCollapsed
                                                                                    ? "bg-sky-700 text-white shadow-lg"
                                                                                    : "bg-sky-700 text-white shadow-lg border-r-4 border-sky-300"
                                                                                : "dark:hover:bg-gray-800 hover:bg-sky-800 hover:text-white"
                                                                        }
                                                                    `}
                                                                >
                                                                    <span className="text-lg flex-shrink-0">
                                                                        {<item.icon />}
                                                                    </span>
                                                                    {!shouldShowCollapsed && (
                                                                        <>
                                                                            <span className="ml-3 flex-1 text-left text-sm lg:text-base truncate font-medium">
                                                                                {item.label}
                                                                            </span>
                                                                            <motion.span
                                                                                animate={{
                                                                                    rotate: openSections[sectionId]
                                                                                        ? 180
                                                                                        : 0,
                                                                                }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="flex-shrink-0"
                                                                            >
                                                                                ▼
                                                                            </motion.span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </TooltipTrigger>
                                                            {shouldShowCollapsed && (
                                                                <TooltipContent side="right" className="ml-20 z-[9999]">
                                                                    {item.label}
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>
                                                    </MotionItem>
                                                    <Collapsible
                                                        isOpen={openSections[sectionId] && !shouldShowCollapsed}
                                                    >
                                                        <div className="pl-4 lg:pl-6 space-y-1 overflow-hidden">
                                                            {item.subItems?.map((sub) => {
                                                                const isSubActive = pathname === sub.route
                                                                return (
                                                                    <button
                                                                        key={sub.label}
                                                                        onClick={() => handleNavClick(sub.route || "#")}
                                                                        className={`flex items-center p-2 w-full text-left text-sm transition-all duration-200 rounded-lg mx-2 relative
                                                                        ${
                                                                            isSubActive
                                                                                ? "bg-sky-700 text-white shadow-md transform scale-105 border-l-4 border-sky-300"
                                                                                : "dark:hover:bg-gray-800 hover:bg-sky-700 hover:text-white hover:shadow-sm hover:transform hover:scale-105"
                                                                        }
                                                                    `}
                                                                    >
                                                                        <span className="truncate font-medium">
                                                                            {sub.label}
                                                                        </span>
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </Collapsible>
                                                </>
                                            ) : (
                                                <MotionItem delay={index}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => handleNavClick(item.route || "#")}
                                                                className={`flex items-center w-full cursor-pointer p-2 lg:p-3 transition-all duration-200 group relative
                                                                ${
                                                                    isActive
                                                                        ? shouldShowCollapsed
                                                                            ? "bg-sky-700 text-white shadow-lg justify-center"
                                                                            : "bg-sky-700 text-white shadow-lg border-r-4 border-sky-300 transform scale-105"
                                                                        : shouldShowCollapsed
                                                                        ? "justify-center dark:hover:bg-gray-800 hover:bg-sky-700 hover:text-white hover:shadow-md"
                                                                        : "dark:hover:bg-gray-800 hover:bg-sky-700 hover:text-white hover:shadow-md hover:transform hover:scale-105"
                                                                }
                                                            `}
                                                            >
                                                                <span className="text-lg flex-shrink-0">
                                                                    {<item.icon />}
                                                                </span>
                                                                {!shouldShowCollapsed && (
                                                                    <span className="ml-3 flex-1 text-left text-sm lg:text-base truncate font-medium">
                                                                        {item.label}
                                                                    </span>
                                                                )}
                                                                {isActive && !shouldShowCollapsed && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="absolute right-0 w-2 h-full bg-sky-300"
                                                                    />
                                                                )}
                                                            </button>
                                                        </TooltipTrigger>
                                                        {shouldShowCollapsed && (
                                                            <TooltipContent side="right" className="ml-2 z-[9999]">
                                                                {item.label}
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </MotionItem>
                                            )}
                                        </div>
                                    )
                                })}
                            </nav>

                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between p-3 lg:p-4 border-t dark:border-gray-800 border-gray-400 overflow-hidden">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center">
                                            <span className="flex-shrink-0">
                                                {isDarkMode ? <FaMoon size={16} /> : <FaSun size={16} />}
                                            </span>
                                            {!shouldShowCollapsed && (
                                                <span className="ml-3 text-sm lg:text-base">
                                                    {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
                                                </span>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    {shouldShowCollapsed && (
                                        <TooltipContent side="right" className="ml-2 z-[9999]">
                                            Theme
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                                {!shouldShowCollapsed && (
                                    <Switch
                                        checked={isDarkMode}
                                        onCheckedChange={() => setIsDarkMode(!isDarkMode)}
                                        className="bg-gray-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-900 flex-shrink-0"
                                    />
                                )}
                            </div>
                        </div>
                    </SidebarTransition>
                </div>
            </TooltipProvider>
        </>
    )
}
