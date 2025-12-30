"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { ICategory } from "@/interfaces/categories/ICategory";
import { CategoryManagementModal } from "@/components/CategorySection/EditCategory/CategoryManagementModal";

interface CategoryOption {
    id: string;
    label: string;
    parentName: string;
    childName: string;
}

interface CategorySelectorProps {
    categories: ICategory[];
    selectedCategoryId: string;
    onCategorySelect: (categoryId: string) => void;
    error?: string;
}

const normalizeText = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
};

export function CategorySelector({ categories, selectedCategoryId, onCategorySelect, error }: CategorySelectorProps) {
    const [showModal, setShowModal] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<CategoryOption[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const subcategories = categories.flatMap((c) => c.subcategories);
        const subCatOptions: CategoryOption[] = subcategories.map((cat) => ({
            id: cat?.categoryID ?? "",
            childName: cat?.name ?? "",
            label: `${categories.find((c) => c.categoryID === cat?.parentID)?.name} / ${cat?.name}`,
            parentName: categories.find((c) => c.categoryID === cat?.parentID)?.name ?? "",
        }));
        setCategoryOptions(subCatOptions);

        const selectedOption = subCatOptions.find(option => option.id === selectedCategoryId);
        if (selectedOption) {
            setSearch(selectedOption.label);
        }

    }, [categories, selectedCategoryId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (searchValue: string) => {
        setSearch(searchValue);

        const normalizedSearch = normalizeText(searchValue);
        const filtered = categoryOptions.filter((option) => {
            const normalizedLabel = normalizeText(option.label);
            return normalizedLabel.includes(normalizedSearch);
        });

        setFilteredOptions(filtered);
        setShowDropdown(searchValue.length > 0);
    };

    const handleSelect = (option: CategoryOption) => {
        onCategorySelect(option.id);
        setSearch(option.label);
        setShowDropdown(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Categoría
                </label>
                <Button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 hover:text-blue-800 bg-slate-200 dark:bg-slate-950 text-sm font-semibold flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" />
                </Button>
                <CategoryManagementModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            </div>
            <div className="relative" ref={dropdownRef}>
                <Input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar categoría..."
                    className={`h-12 text-base border-2 transition-all duration-200 ${
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                {showDropdown && filteredOptions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.map((option, optIndex) => (
                            <Button
                                key={optIndex}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="w-full text-left px-4 py-3 dark:bg-slate-800 bg-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {option.parentName}
                                    </div>
                                    <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {option.childName}
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                </div>
            )}
        </div>
    );
}
