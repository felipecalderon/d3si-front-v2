export const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result)
            } else {
                reject(new Error("Failed to read file as ArrayBuffer."))
            }
        }

        reader.onerror = (error) => {
            reject(error)
        }

        reader.readAsArrayBuffer(file)
    })
}
