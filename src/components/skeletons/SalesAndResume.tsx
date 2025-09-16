import { Skeleton } from "../ui/skeleton"

export default function SalesAndResumeSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Izquierda */}
            <div className="flex flex-col gap-6">
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Centro */}
            <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-full w-full rounded-md" />
            </div>

            {/* Derecha */}
            <div className="flex flex-col gap-6">
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
            </div>
        </div>
    )
}
