import { create } from "zustand"
import { IUser } from "@/interfaces/users/IUser"
import { IStore } from "@/interfaces/stores/IStore"

interface UserStore {
  user: any
  users: IUser[]
  stores: IStore[]
  setUser: (user: any) => void
  setUsers: (users: IUser[]) => void
  setStores: (stores: IStore[]) => void
  logout: () => void
}

export const useAuth = create<UserStore>((set) => ({
  user: null,
  users: [],
  stores: [],
  setUser: (user) => set({ user }),
  setUsers: (users) => set({ users }),
  setStores: (stores) => set({ stores }),
  logout: () => set({ user: null, users: [], stores: [] }),
}))
