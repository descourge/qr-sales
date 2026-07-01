"use client";

import { useEffect, useMemo, useState } from "react";

import {
  History,
  Search,
  Eye,
  ShoppingCart,
  DollarSign,
  MapPin,
  MapPinOff,
  Package,
} from "lucide-react";

import { getSalesHistory } from "@/features/sales/services/history.service";

import { SaleHistory } from "@/features/sales/types/sale-history";

import SaleCompletedModal from "@/features/sales/components/SaleCompletedModal";

export default function SalesHistoryPage() {
  const [sales, setSales] =
    useState<SaleHistory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedSale, setSelectedSale] =
    useState<SaleHistory | null>(null);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    setLoading(true);

    const data =
      await getSalesHistory();

    setSales(data);

    setLoading(false);
  }

  const filteredSales = useMemo(() => {
    const value =
      search.toLowerCase();

    return sales.filter((sale) =>
      sale.id.toString().includes(value)
    );
  }, [sales, search]);

  const totalAmount = useMemo(() => {
    return sales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );
  }, [sales]);

  const averageSale = useMemo(() => {
    if (sales.length === 0) return 0;

    return totalAmount / sales.length;
  }, [sales, totalAmount]);

  return (
    <div className="space-y-8">

      {/* Encabezado */}

      <div className="space-y-1">

        <div className="flex items-center gap-3">

          <History
            size={30}
            className="text-[#3C83F6]"
          />

          <h1 className="text-3xl font-bold text-[#333333] sm:text-4xl">

            Historial de ventas

          </h1>

        </div>

        <p className="text-slate-500">

          Consulte todas las ventas registradas.

        </p>

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <ShoppingCart className="text-[#3C83F6]" />

            <div>

              <p className="text-sm text-slate-500">

                Ventas

              </p>

              <p className="text-3xl font-bold">

                {sales.length}

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <DollarSign className="text-green-600" />

            <div>

              <p className="text-sm text-slate-500">

                Total vendido

              </p>

              <p className="text-3xl font-bold">

                $
                {Math.round(
                  totalAmount
                ).toLocaleString("es-CL")}

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <Package className="text-[#F6BF1C]" />

            <div>

              <p className="text-sm text-slate-500">

                Promedio

              </p>

              <p className="text-3xl font-bold">

                $
                {Math.round(
                  averageSale
                ).toLocaleString("es-CL")}

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Buscador */}

      <div className="relative">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          placeholder="Buscar venta..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            py-3
            pl-11
            pr-4
            outline-none
            transition
            focus:border-[#3C83F6]
            focus:ring-2
            focus:ring-[#3C83F6]/20
          "
        />

      </div>

      {/* Tabla */}

      <div
        className="
          overflow-x-auto
          overscroll-x-contain
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          [-webkit-overflow-scrolling:touch]
        "
      >

        <table className="min-w-[920px] w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Venta
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Fecha
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Productos
              </th>

              <th className="px-5 py-4 text-right text-sm font-semibold">
                Total
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                GPS
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              [...Array(6)].map((_, index) => (

                <tr key={index}>

                  <td
                    colSpan={6}
                    className="p-4"
                  >

                    <div className="h-10 animate-pulse rounded bg-slate-100" />

                  </td>

                </tr>

              ))

            ) : filteredSales.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-16"
                >

                  <div className="flex flex-col items-center gap-3">

                    <History
                      size={42}
                      className="text-slate-300"
                    />

                    <p className="text-slate-500">

                      No existen ventas registradas.

                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredSales.map((sale) => (

                <tr
                  key={sale.id}
                  className="
                    border-t
                    transition-colors
                    hover:bg-slate-50
                  "
                >

                  <td className="px-5 py-4 text-center font-semibold">

                    #{sale.id}

                  </td>

                  <td className="px-5 py-4 text-center">

                    {new Date(
                      sale.createdAt
                    ).toLocaleString("es-CL")}

                  </td>

                  <td className="px-5 py-4 text-center">

                    {sale.details.length}

                  </td>

                  <td
                    className="
                      px-5
                      py-4
                      text-right
                      font-bold
                      text-[#3C83F6]
                    "
                  >

                    $
                    {Number(
                      sale.total
                    ).toLocaleString("es-CL")}

                  </td>

                  <td className="px-5 py-4 text-center">

                    {sale.latitude !== null &&
                    sale.longitude !== null ? (

                      <button
                        type="button"
                        title="Abrir ubicación"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${sale.latitude},${sale.longitude}`,
                            "_blank"
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          p-2
                          text-green-600
                          transition-all
                          duration-200
                          hover:bg-green-50
                          hover:shadow-sm
                        "
                      >

                        <MapPin size={18} />

                      </button>

                    ) : (

                      <MapPinOff
                        size={18}
                        className="mx-auto text-slate-400"
                      />

                    )}

                  </td>

                  <td className="px-5 py-4 text-center">

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpen(true);
                      }}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-[#3C83F6]
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition-all
                        duration-200
                        hover:bg-[#2F6FD3]
                        hover:shadow
                      "
                    >

                      <Eye size={16} />

                      Ver

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Modal */}

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
          latitude={selectedSale.latitude}
          longitude={selectedSale.longitude}
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