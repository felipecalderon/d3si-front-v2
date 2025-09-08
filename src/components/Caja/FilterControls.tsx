"use client"

import FilterStoreMonthYear from "./FilterStoreMonthYear"
import { useSalesFilters } from "@/stores/salesFilters.store"

const FilterControls = () => {
    const setFilters = useSalesFilters((s) => s.setFilters)

    return (
        <div className="sm:w-auto">
            <FilterStoreMonthYear onChange={setFilters} />
        </div>
    )
}

export default FilterControls
