import React from "react"
import type { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"

interface PrintOrderProps {
    order: IOrderWithStore
    neto: number
    iva: number
    totalConIva: number
}

const PrintOrder: React.FC<PrintOrderProps> = ({ order, neto, iva, totalConIva }) => {
    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })

    return (
        <div style={{ fontFamily: "serif", color: "#222", padding: 24, maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Orden de Compra</h1>
            <hr style={{ margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                    <div>
                        <strong>Folio:</strong> {order.orderID}
                    </div>
                    <div>
                        <strong>Fecha:</strong> {fecha}
                    </div>
                    <div>
                        <strong>Estado:</strong> {order.status}
                    </div>
                </div>
                <div>
                    <div>
                        <strong>Tipo:</strong> {order.type}
                    </div>
                    <div>
                        <strong>DTE:</strong> {order.dte || "Sin DTE"}
                    </div>
                    <div>
                        <strong>Descuento:</strong> $
                        {parseFloat(order.discount || "0").toLocaleString("es-CL", { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
            <hr style={{ margin: "12px 0" }} />
            <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Tienda</h2>
                <div>
                    <strong>Nombre:</strong> {order.Store?.name || "-"}
                </div>
                <div>
                    <strong>Dirección:</strong> {order.Store?.address || "-"}
                </div>
                <div>
                    <strong>Teléfono:</strong> {order.Store?.phone || "-"}
                </div>
                <div>
                    <strong>Email:</strong> {order.Store?.email || "-"}
                </div>
                <div>
                    <strong>Ciudad:</strong> {order.Store?.city || "-"}
                </div>
            </div>
            <hr style={{ margin: "12px 0" }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Productos</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginBottom: 16 }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #888", padding: 4 }}>SKU</th>
                        <th style={{ border: "1px solid #888", padding: 4 }}>Nombre</th>
                        <th style={{ border: "1px solid #888", padding: 4 }}>Talla</th>
                        <th style={{ border: "1px solid #888", padding: 4 }}>Cantidad</th>
                        <th style={{ border: "1px solid #888", padding: 4 }}>Precio</th>
                        <th style={{ border: "1px solid #888", padding: 4 }}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.ProductVariations?.map((item) => (
                        <tr key={item.variationID}>
                            <td style={{ border: "1px solid #888", padding: 4 }}>{item.sku}</td>
                            <td style={{ border: "1px solid #888", padding: 4 }}>{item.Product?.name || "-"}</td>
                            <td style={{ border: "1px solid #888", padding: 4 }}>{item.sizeNumber}</td>
                            <td style={{ border: "1px solid #888", padding: 4 }}>
                                {item.OrderProduct?.quantityOrdered ?? "-"}
                            </td>
                            <td style={{ border: "1px solid #888", padding: 4 }}>
                                ${parseFloat(item.priceList).toLocaleString("es-CL", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ border: "1px solid #888", padding: 4 }}>
                                {item.OrderProduct &&
                                    (typeof item.OrderProduct.subtotal === "number"
                                        ? item.OrderProduct.subtotal.toLocaleString("es-CL", {
                                              style: "currency",
                                              currency: "CLP",
                                              minimumFractionDigits: 2,
                                          })
                                        : Number(item.OrderProduct.subtotal).toLocaleString("es-CL", {
                                              style: "currency",
                                              currency: "CLP",
                                              minimumFractionDigits: 2,
                                          }))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <table style={{ fontSize: 16 }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: "2px 8px", fontWeight: 600 }}>Neto:</td>
                            <td style={{ padding: "2px 8px", textAlign: "right" }}>
                                {neto.toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                    minimumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "2px 8px", fontWeight: 600 }}>IVA (19%):</td>
                            <td style={{ padding: "2px 8px", textAlign: "right" }}>
                                {iva.toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                    minimumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "2px 8px", fontWeight: 700, fontSize: 18 }}>Total:</td>
                            <td style={{ padding: "2px 8px", textAlign: "right", fontWeight: 700, fontSize: 18 }}>
                                {totalConIva.toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                    minimumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "#888" }}>
                Documento generado automáticamente por el sistema D3SI
            </div>
        </div>
    )
}

export default PrintOrder
