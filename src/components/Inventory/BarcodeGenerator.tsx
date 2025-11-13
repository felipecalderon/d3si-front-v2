import React from "react"
import Barcode from "react-barcode"

interface Props {
    value: string
}

export default function Ean13Generator({ value }: Props) {
    return <Barcode className="mx-auto" value={value} format="EAN13" width={2} height={50} displayValue={true} />
}
