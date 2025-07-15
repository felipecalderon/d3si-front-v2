import { create } from "zustand"
import { IUser } from "@/interfaces/users/IUser"
import { useTienda } from "./tienda.store"

interface UserStore {
    user: any
    users: IUser[]
    setUsers: (users: any) => void
    setUser: (user: any) => void
    logout: () => void
}

export const useAuth = create<UserStore>((set) => ({
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
}))
