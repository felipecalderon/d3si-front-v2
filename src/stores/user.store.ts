import { create } from "zustand"
import { persist } from "zustand/middleware"
import { IUser } from "@/interfaces/users/IUser"
//import { IStore } from "@/interfaces/stores/IStore"
import { useTienda } from "./tienda.store"

interface UserStore {
    user: IUser | null
    setUser: (user: IUser) => void
    logout: () => void
}

export const useAuth = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => {
                const { setStores, setUsers } = useTienda.getState()
                setStores([])
                setUsers([])
                set({ user: null })
            },
        }),
        {
            name: "auth-storage", // nombre de la clave en localStorage
        }
    )
)
