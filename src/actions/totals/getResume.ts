"use server"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IResume } from "@/interfaces/sales/ISalesResume"

export const getResume = async (storeID: string, date: string): Promise<IResume> => {
    return await fetcher(`${API_URL}/home?date=${date}&storeID=${storeID || ""}`)
}
