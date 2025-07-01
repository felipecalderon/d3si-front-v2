import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IResume } from "@/interfaces/sales/ISalesResume"

export const getResume = async (): Promise<IResume> =>{
    return await fetcher(`${API_URL}/home`)
}