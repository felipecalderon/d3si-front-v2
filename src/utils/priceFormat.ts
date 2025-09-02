export const toPrice = (input: string | number): string => {
    const num = typeof input === "number" ? input : Number(input.replace(/[^\d.-]/g, ""))
    const int = Math.trunc(num)
    return int.toLocaleString("es-CL")
}
