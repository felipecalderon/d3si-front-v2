import React from "react"
import { getSales } from "@/actions/sales/getSales"
import HomeContentClient from "@/components/dashboard/HomeContentClient"

const HomePage = async () => {
    const storeID = "f3c9d8e0-ccaf-4300-a416-c3591c4d8b52" // ID hardcodeado por ahora
    const sales = (await getSales(storeID)) as Sale[]

    return <HomeContentClient sales={sales} />
}

export default HomePage
