import { API_URL } from "@/lib/enviroments";
import { fetcher } from "@/lib/fetcher";

export const getSales = async (storeID: string) => {
  return await fetcher(`${API_URL}/sale?storeID=${storeID}`);
};
