export const toPrice = (input: string | number | undefined | null): string => {
    if (input === undefined || input === null) return "0"
    const num = typeof input === "number" ? input : Number(input.toString().replace(/[^\d.-]/g, ""))
    const int = Math.trunc(Number.isNaN(num) ? 0 : num)
    return int.toLocaleString("es-CL")
}
