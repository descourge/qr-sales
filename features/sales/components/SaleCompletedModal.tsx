"use client";

import { SaleItem } from "../types/sale-item";

type Props = {
  open: boolean;
  saleId: number;
  createdAt: string;
  total: number;
  hasLocation: boolean;
  items: SaleItem[];
  onClose: () => void;
  buttonText?: string;
};

export default function SaleCompletedModal({
  open,
  saleId,
  createdAt,
  total,
  hasLocation,
  items,
  onClose,
  buttonText = "Cerrar",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">

        {/* Encabezado */}

        <div className="rounded-t-xl bg-green-600 p-6 text-white">

          <h2 className="text-3xl font-bold">
            ✅ Venta registrada
          </h2>

          {saleId > 0 ? (
            <p className="mt-2">
                Venta N° {saleId}
            </p>
            ) : (
            <p className="mt-2 font-medium text-yellow-200">
                Pendiente de sincronización
            </p>
            )}

          <p className="text-sm opacity-90">
            {createdAt}
          </p>

        </div>

        {/* Cuerpo */}

        <div className="p-6">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="pb-3 text-left">
                  Código
                </th>

                <th className="pb-3 text-left">
                  Producto
                </th>

                <th className="pb-3 text-center">
                  Cant.
                </th>

                <th className="pb-3 text-right">
                  Precio
                </th>

                <th className="pb-3 text-right">
                  Subtotal
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr
                  key={item.articleId}
                  className="border-b"
                >

                  <td className="py-3 font-mono">
                    {item.code}
                  </td>

                  <td>
                    {item.description}
                  </td>

                  <td className="text-center">
                    {item.quantity}
                  </td>

                  <td className="text-right">
                    $
                    {item.unitPrice.toLocaleString("es-CL")}
                  </td>

                  <td className="text-right font-medium">
                    $
                    {item.subtotal.toLocaleString("es-CL")}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="mt-6 border-t pt-5">

            <div className="flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span>
                $
                {total.toLocaleString("es-CL")}
              </span>

            </div>

            <div className="mt-5 rounded-lg bg-slate-100 p-4">

              <div className="flex items-center justify-between">

                <span>
                  Ubicación GPS
                </span>

                <span>

                  {hasLocation
                    ? "📍 Registrada"
                    : "⚠️ No disponible"}

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Pie */}

        <div className="flex justify-end gap-3 border-t p-6">

          {/* <button
            type="button"
            className="rounded bg-slate-200 px-5 py-2 hover:bg-slate-300"
            onClick={() => window.print()}
          >
            Imprimir
          </button> */}

          <button
            type="button"
            className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            onClick={onClose}
          >
            {buttonText}
          </button>

        </div>

      </div>

    </div>
  );
}