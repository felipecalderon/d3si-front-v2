import { create } from "zustand"

interface ToasterStore {
    activeToastId: number | null
    setToastId: (id: number | null) => void
}

export const useLoadingToaster = create<ToasterStore>((set) => ({
    activeToastId: null,
    setToastId: (id) => set({ activeToastId: id }),
}))
