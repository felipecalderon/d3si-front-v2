import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IProduct } from "@/interfaces/IProduct"


export const updateProduct = async (product: IProduct): Promise<void> =>{
    try{
        const response = await fetcher(`${API_URL}/products/?${queryParams.toString()}`)
    }
    catch(error){

    }
}