"use client";

import { useEffect, useState } from "react";

import { getSalesHistory } from "@/features/sales/services/history.service";

import { SaleHistory } from "@/features/sales/types/sale-history";

import SaleCompletedModal from "@/features/sales/components/SaleCompletedModal";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleHistory[]>([]);

  const [selectedSale, setSelectedSale] =
    useState<SaleHistory | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const data = await getSalesHistory();

    setSales(data);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Historial de Ventas
      </h1>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-center">
                Venta
              </th>

              <th className="p-3 text-center">
                Fecha
              </th>

              <th className="p-3 text-center">
                Productos
              </th>

              <th className="p-3 text-right">
                Total
              </th>

              <th className="p-3 text-center">
                GPS
              </th>

              <th className="p-3 text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-slate-500"
                >
                  No existen ventas registradas.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t transition-colors hover:bg-slate-50"
                >
                  <td className="p-3 text-center font-semibold">
                    #{sale.id}
                  </td>

                  <td className="p-3 text-center">
                    {new Date(
                      sale.createdAt
                    ).toLocaleString("es-CL")}
                  </td>

                  <td className="p-3 text-center">
                    {sale.details.length}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    $
                    {Number(sale.total).toLocaleString(
                      "es-CL"
                    )}
                  </td>

                  <td className="p-3 text-center text-xl">
                    {sale.latitude &&
                    sale.longitude
                      ? "📍"
                      : "❌"}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpen(true);
                      }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <SaleCompletedModal
          open={open}
          saleId={selectedSale.id}
          createdAt={new Date(
            selectedSale.createdAt
          ).toLocaleString("es-CL")}
          total={Number(selectedSale.total)}
          hasLocation={
            selectedSale.latitude !== null &&
            selectedSale.longitude !== null
          }
          items={selectedSale.details.map(
            (detail) => ({
              articleId: detail.articleId,
              code: detail.article.code,
              description:
                detail.article.description,
              quantity: detail.quantity,
              unitPrice: Number(detail.unitPrice),
              subtotal: Number(detail.subtotal),
            })
          )}
          onClose={() => {
            setOpen(false);
            setSelectedSale(null);
          }}
          buttonText="Cerrar"
        />
      )}
    </div>
  );
}