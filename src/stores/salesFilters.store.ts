import { create } from "zustand"

export type SalesFilters = { storeID?: string; month?: string; year?: string } | null

type State = {
    filters: SalesFilters
    setFilters: (f: SalesFilters) => void
    reset: () => void
}

export const useSalesFilters = create<State>((set) => ({
    filters: null,
    setFilters: (f) => set({ filters: f && Object.keys(f).length ? f : null }),
    reset: () => set({ filters: null }),
}))
