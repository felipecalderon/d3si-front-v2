import { create } from "zustand"
import { IUser } from "@/interfaces/users/IUser"
import { IStore } from "@/interfaces/stores/IStore"
import { useTienda } from "./tienda.store"

interface UserStore {
    user: any
    setUser: (user: any) => void
    logout: () => void
}

export const useAuth = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
        const { setStores, setUsers } = useTienda.getState()
        setStores([])
        setUsers([])
        set({ user: null })
    },
}))
