"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

interface InventoryPaginationProps {
    currentPage: number
    totalPages: number
    getVisiblePages: () => (number | string)[]
    setCurrentPage: (page: number) => void
}

export default function InventoryPagination({
    currentPage,
    totalPages,
    getVisiblePages,
    setCurrentPage,
}: InventoryPaginationProps) {
    return (
        <div className="flex items-center justify-center gap-2 mt-6 pb-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 px-3 border-2"
            >
                <ChevronLeft className="h-4 w-4" />
                Anterior
            </Button>

            {getVisiblePages().map((page, index) => (
                <React.Fragment key={index}>
                    {page === "..." ? (
                        <span className="px-2 text-gray-500">...</span>
                    ) : (
                        <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className={`h-9 w-9 border-2 ${
                                currentPage === page
                                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            {page}
                        </Button>
                    )}
                </React.Fragment>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 px-3 border-2"
            >
                Siguiente
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
