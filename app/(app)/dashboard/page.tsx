"use client";

import { useEffect, useState } from "react";

import { getDashboard } from "@/features/dashboard/services/dashboard.service";

import AnimatedNumber from "@/shared/components/AnimatedNumber";

export default function DashboardPage() {

  const [dashboard, setDashboard] =
    useState<any>(null);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    const data =
      await getDashboard();

    setDashboard(data);

  }

  if (!dashboard) {
  return (
    <div className="space-y-8 animate-pulse">

      <div className="h-10 w-72 rounded bg-slate-200" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-xl bg-slate-200"
          />
        ))}

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="h-96 rounded-xl bg-slate-200" />

        <div className="h-96 rounded-xl bg-slate-200" />

      </div>

    </div>
  );
}

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <p className="text-slate-500">
      Ventas hoy
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      <AnimatedNumber
  value={dashboard.salesCount}
/>
    </h2>
  </div>

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <p className="text-slate-500">
      Total vendido
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      <AnimatedNumber
  value={dashboard.totalSales}
  prefix="$"
/>
    </h2>
  </div>

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <p className="text-slate-500">
      Artículos vendidos
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      <AnimatedNumber
  value={dashboard.itemsSold}
/>
    </h2>
  </div>

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <p className="text-slate-500">
      Promedio por venta
    </p>

    <h2 className="mt-2 text-4xl font-bold">
      <AnimatedNumber
  value={Math.round(
    dashboard.averageSale
  )}
  prefix="$"
/>
    </h2>
  </div>

</div>

<div className="grid gap-6 lg:grid-cols-2">

  {/* Top Productos */}

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    <h2 className="mb-4 text-xl font-bold">
  Productos más vendidos
</h2>

<table className="w-full">

  <thead className="border-b">

    <tr>

      <th className="pb-2 text-center">
        #
      </th>

      <th className="pb-2 text-left">
        Producto
      </th>

      <th className="pb-2 text-center">
        Cantidad
      </th>

    </tr>

  </thead>

  <tbody>

    {dashboard.topProducts.length === 0 ? (

      <tr>

        <td
          colSpan={3}
          className="p-6 text-center text-slate-500"
        >
          Sin información.
        </td>

      </tr>

    ) : (

      dashboard.topProducts.map(
        (product: any, index: number) => (

          <tr
            key={product.code}
            className="
border-b
transition-colors
duration-200
hover:bg-slate-50
"
          >

            <td className="py-3 text-center font-semibold">

              {index + 1}

            </td>

            <td>

              <div className="font-mono">
                {product.code}
              </div>

              <div className="text-sm text-slate-500">
                {product.description}
              </div>

            </td>

            <td className="text-center font-semibold">

              {product.quantity}

            </td>

          </tr>

        )

      )

    )}

  </tbody>

</table>

  </div>

  {/* Últimas Ventas */}

  <div className="animate-fade-up rounded-xl border bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    <h2 className="mb-4 text-xl font-bold">
  Últimas ventas
</h2>

<table className="w-full">

  <thead className="border-b">

    <tr>

      <th className="pb-2 text-center">
        Venta
      </th>

      <th className="pb-2 text-center">
        Fecha
      </th>

      <th className="pb-2 text-right">
        Total
      </th>

    </tr>

  </thead>

  <tbody>

    {dashboard.lastSales.length === 0 ? (

      <tr>

        <td
          colSpan={3}
          className="p-6 text-center text-slate-500"
        >
          Sin ventas.
        </td>

      </tr>

    ) : (

      dashboard.lastSales.map((sale: any) => (

        <tr
          key={sale.id}
          className="
border-b
transition-colors
duration-200
hover:bg-slate-50
"
        >

          <td className="py-3 text-center font-semibold">
            #{sale.id}
          </td>

          <td className="text-center">
            {new Date(
              sale.createdAt
            ).toLocaleString("es-CL")}
          </td>

          <td className="text-right font-semibold">
            $
            {Number(sale.total).toLocaleString("es-CL")}
          </td>

        </tr>

      ))

    )}

  </tbody>

</table>

  </div>

</div>



    </div>
  );
}