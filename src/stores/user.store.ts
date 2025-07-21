import { create } from "zustand"
import { persist } from "zustand/middleware"
import { IUser } from "@/interfaces/users/IUser"
import { useTienda } from "./tienda.store"

type IUserNoStores = Omit<IUser, "Stores">
interface UserStore {
    user: IUserNoStores | null
    users: IUser[]
    setUsers: (users: IUser[]) => void
    setUser: (user: IUserNoStores) => void
    logout: () => void
}

export const useAuth = create(
    persist<UserStore>(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            users: [],
            setUsers: (users) => set({ users }),
            logout: () => {
                const { setStores } = useTienda.getState()
                const { setUsers } = useAuth.getState()
                setStores([])
                setUsers([])
                set({ user: null })
            },
        }),
        { name: "auth-storage" }
    )
)
