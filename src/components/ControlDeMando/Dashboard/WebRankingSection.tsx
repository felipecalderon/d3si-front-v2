"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { datosRankingWeb } from "../Data/constants"

export default function WebRankingSection() {
    return (
        <div className="lg:col-span-4 lg:row-span-5">
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm dark:text-white">
                        Ranking Ventas Canal Web 5%
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 md:space-y-4">
                        {datosRankingWeb.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.categoria}
                                    </span>
                                    <span className="text-xs font-medium text-white bg-teal-600 px-2 py-0.5 rounded">
                                        {item.valor} mil
                                    </span>
                                </div>
                                <Progress
                                    value={item.valor}
                                    className="h-2 md:h-3 bg-gray-200 dark:bg-gray-700 [&>div]:bg-orange-400"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}