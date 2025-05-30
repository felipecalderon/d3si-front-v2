export const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}
