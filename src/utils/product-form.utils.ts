import { ICategory } from "@/interfaces/categories/ICategory";

// Normaliza texto para comparar categorías
export const normalize = (str: string) =>
    str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim() || "";

// Buscar categoryID por nombre (mejorado: busca en todas las subcategorías, tolerante a vacíos)
export const findCategoryIdByName = (categories: ICategory[], catName: string) => {
    const norm = normalize(catName || "");
    if (!norm) return "";

    // 1. Coincidencia exacta en categoría padre
    const found = categories.find((cat) => normalize(cat.name) === norm);
    if (found) return found.categoryID;

    // 2. Coincidencia exacta en cualquier subcategoría (nombre del hijo)
    for (const cat of categories) {
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
            for (const subcat of cat.subcategories) {
                if (normalize(subcat?.name || "") === norm) {
                    return subcat.categoryID || "";
                }
            }
        }
    }

    // 3. Coincidencia parcial (incluye) en cualquier subcategoría
    for (const cat of categories) {
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
            for (const subcat of cat.subcategories) {
                if (normalize(subcat?.name || "").includes(norm)) {
                    return subcat.categoryID || "";
                }
            }
        }
    }

    // 4. Coincidencia parcial (incluye) en categoría padre
    const foundPartial = categories.find((cat) => normalize(cat.name).includes(norm));
    if (foundPartial) return foundPartial.categoryID;

    return "";
};

export function generateRandomSku() {
    let sku = "1";
    for (let i = 0; i < 11; i++) {
        sku += Math.floor(Math.random() * 10).toString();
    }
    return sku;
}

export const calculateMarkup = (priceCost: number, priceList: number): string => {
    if (priceCost === 0) return "N/A";
    const markup = priceList / priceCost;
    return markup.toFixed(2);
};
