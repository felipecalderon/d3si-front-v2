"use server"
import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"

export const getResume = async (storeID?: string): Promise<IResume> => {
    const date = new Date()
    const utcDate = formatDateToYYYYMMDD(date)
    return await fetcher(`${API_URL}/home?date=${utcDate}&storeID=${storeID || ""}`)
}
