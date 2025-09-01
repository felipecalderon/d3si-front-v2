type DateYYYYMMDD = `${string}-${string}-${string}`
export const formatDateToYYYYMMDD = (date: Date): DateYYYYMMDD => {
    const year = date.getFullYear()
    // getMonth() es base 0 (Enero es 0), así que sumamos 1
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
}
