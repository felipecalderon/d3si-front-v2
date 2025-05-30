import { create } from "zustand"

interface UserStore {
    user: any
    setUser: (user: any) => void
}

export const useAuth = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))
