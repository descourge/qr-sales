"use client";

import { useEffect, useState } from "react";


import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

import { getDashboard } from "@/features/dashboard/services/dashboard.service";
import AnimatedNumber from "@/shared/components/AnimatedNumber";

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns";

import { useSession } from "@/features/auth/context/SessionProvider";

import {

  getCategories,

} from "@/features/categories/services/category.service";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<any>(null);

    const {
  session,
} = useSession();

const [filters, setFilters] = useState<{
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
}>({});

const [appliedFilters, setAppliedFilters] = useState<{
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
}>({});

type Category = {

  id: number;

  name: string;

  color: string | null;

};

const [

  categories,

  setCategories,

] = useState<Category[]>([]);

async function loadCategories(
  companyId: number
) {

  const data =
    await getCategories(
      companyId
    );

  setCategories(data);

}

const appliedCategory =
  categories.find(

    category =>

      category.id ===
      appliedFilters.categoryId

  );

useEffect(() => {

  if (!session) {

    return;

  }

  loadCategories(
    session.company.id
  );

  loadDashboard(
    session.company.id
  );

}, [session]);

async function loadDashboard(

  companyId: number,

  currentFilters = filters

) {

  const data =
    await getDashboard(

      companyId,

      currentFilters

    );

  if (!data) {

    return;

  }

  setDashboard(data);

}

  if (!dashboard) {
    return (
      <div className="space-y-10 animate-pulse">

        <div className="h-12 w-80 rounded-xl bg-slate-200" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl bg-slate-200"
            />
          ))}

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="h-96 rounded-2xl bg-slate-200" />

          <div className="h-96 rounded-2xl bg-slate-200" />

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-10">

      <div className="space-y-1">

        <h1 className="text-4xl font-bold text-[#333333]">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Resumen general de ventas y actividad del sistema.
        </p>

      </div>

      {/* KPIs */}

      

<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <div
    className="
      grid
      gap-4
      lg:grid-cols-[1fr_1fr_1fr_auto_auto]
    "
  >

    {/* Fecha inicio */}

    <Popover>

      <PopoverTrigger asChild>

        <Button
          variant="outline"
          data-empty={!filters.startDate}
          className="
            h-11
            w-full
            justify-start
            text-left
            font-normal
            data-[empty=true]:text-muted-foreground
          "
        >

          <CalendarIcon className="mr-2 h-4 w-4" />

          {filters.startDate
            ? format(filters.startDate, "dd/MM/yyyy")
            : "Fecha inicio"}

        </Button>

      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
      >

        <Calendar
          mode="single"
          selected={filters.startDate}
          onSelect={(date) =>
            setFilters({
              ...filters,
              startDate: date,
            })
          }
        />

      </PopoverContent>

    </Popover>

    {/* Fecha fin */}

    <Popover>

      <PopoverTrigger asChild>

        <Button
          variant="outline"
          data-empty={!filters.endDate}
          className="
            h-11
            w-full
            justify-start
            text-left
            font-normal
            data-[empty=true]:text-muted-foreground
          "
        >

          <CalendarIcon className="mr-2 h-4 w-4" />

          {filters.endDate
            ? format(filters.endDate, "dd/MM/yyyy")
            : "Fecha fin"}

        </Button>

      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
      >

        <Calendar
          mode="single"
          selected={filters.endDate}
          onSelect={(date) =>
            setFilters({
              ...filters,
              endDate: date,
            })
          }
        />

      </PopoverContent>

    </Popover>

    {/* Categoría */}

    <Select
      value={
  filters.categoryId
    ? String(filters.categoryId)
    : undefined
}

onValueChange={(value) =>
  setFilters({
    ...filters,
    categoryId: Number(value),
  })
}
    >

      <SelectTrigger
        className="h-11 w-full"
      >

        <SelectValue
          placeholder="Categoría"
        />

      </SelectTrigger>

      <SelectContent>

        <SelectGroup>

          <SelectLabel>
            Categorías
          </SelectLabel>

{categories.map(category => (

  <SelectItem

    key={category.id}

    value={String(category.id)}

  >

    {category.name}

  </SelectItem>

))}

        </SelectGroup>

      </SelectContent>

    </Select>

    {/* Aplicar */}

<Button
  onClick={() => {

    if (!session) {

      return;

    }

    setAppliedFilters(filters);

    loadDashboard(

      session.company.id,

      filters

    );

  }}
>

  Aplicar filtros

</Button>

    {/* Limpiar */}

<Button

  variant="outline"

  onClick={() => {

    const empty = {};

    setFilters(empty);

    setAppliedFilters(empty);

    if (session) {

      loadDashboard(

        session.company.id,

        empty

      );

    }

  }}

>

  Limpiar

</Button>

  </div>

</div>

<div
  key={JSON.stringify(appliedFilters)}
  className="
    inline-flex
    max-w-fit
    animate-filter-change
    rounded-xl
    border
    border-blue-200
    bg-blue-50
    px-5
    py-3
    shadow-sm
  "
>

  <div className="flex flex-col">

    <span className="text-sm font-semibold text-blue-700">
      Mostrando información
    </span>

    <span className="text-sm text-slate-600">

      {appliedFilters.startDate || appliedFilters.endDate ? (
  <>
    {appliedFilters.startDate
      ? format(appliedFilters.startDate, "dd/MM/yyyy")
      : "Inicio"}

    {" — "}

    {appliedFilters.endDate
      ? format(appliedFilters.endDate, "dd/MM/yyyy")
      : "Hoy"}
  </>
) : (
"Ventas totales"
)}
{appliedCategory && (

  <>

    {" · "}

    Categoría:

    <span className="font-semibold">

      {" "}

      {appliedCategory.name}

    </span>

  </>

)}

    </span>

  </div>

</div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* Ventas */}

        <div className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="h-1 bg-[#3C83F6]" />

          <div className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">

{appliedFilters.startDate ||
 appliedFilters.endDate ||
 appliedFilters.categoryId
  ? "Ventas filtradas"
  : "Ventas totales"}

</p>

              <h2 className="mt-2 text-4xl font-bold text-[#333333]">

                <AnimatedNumber
                  value={dashboard.salesCount}
                />

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3C83F6]/10">

              <ShoppingCart
                size={28}
                className="text-[#3C83F6]"
              />

            </div>

          </div>

        </div>

        {/* Total */}

        <div className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animation-delay-100">

          <div className="h-1 bg-[#F6BF1C]" />

          <div className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Total vendido
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#333333]">

                <AnimatedNumber
                  value={dashboard.totalSales}
                  prefix="$"
                />

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6BF1C]/15">

              <DollarSign
                size={28}
                className="text-[#F6BF1C]"
              />

            </div>

          </div>

        </div>

        {/* Artículos */}

        <div className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animation-delay-200">

          <div className="h-1 bg-[#3C83F6]" />

          <div className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Artículos vendidos
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#333333]">

                <AnimatedNumber
                  value={dashboard.itemsSold}
                />

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3C83F6]/10">

              <Package
                size={28}
                className="text-[#3C83F6]"
              />

            </div>

          </div>

        </div>

        {/* Promedio */}

        <div className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animation-delay-300">

          <div className="h-1 bg-[#F6BF1C]" />

          <div className="flex items-center justify-between p-6">

            <div>

              <p className="text-sm text-slate-500">
                Promedio por venta
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#333333]">

                <AnimatedNumber
                  value={Math.round(
                    dashboard.averageSale
                  )}
                  prefix="$"
                />

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6BF1C]/15">

              <TrendingUp
                size={28}
                className="text-[#F6BF1C]"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Tablas */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Productos */}

        <div className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">

          <div className="mb-6 flex items-center gap-3">

            <Package
              size={24}
              className="text-[#3C83F6]"
            />

            <h2 className="text-xl font-bold text-[#333333]">
              Productos más vendidos
            </h2>

          </div>

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="pb-3 text-center">
                  #
                </th>

                <th className="pb-3 text-left">
                  Producto
                </th>

                <th className="pb-3 text-center">
                  Cantidad
                </th>

              </tr>

            </thead>

            <tbody>

              {dashboard.topProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="p-8 text-center text-slate-500"
                  >
                    Sin información.
                  </td>

                </tr>

              ) : (

                dashboard.topProducts.map(
                  (
                    product: any,
                    index: number
                  ) => (

                    <tr
                      key={product.code}
                      className="border-b transition-colors duration-200 hover:bg-blue-50"
                    >

                      <td className="py-3 text-center">

                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#3C83F6] text-sm font-bold text-white">

                          {index + 1}

                        </div>

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

        {/* Ventas */}

        <div className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">

          <div className="mb-6 flex items-center gap-3">

            <ShoppingCart
              size={24}
              className="text-[#3C83F6]"
            />

            <h2 className="text-xl font-bold text-[#333333]">
              Últimas ventas
            </h2>

          </div>

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="pb-3 text-center">
                  Venta
                </th>

                <th className="pb-3 text-center">
                  Fecha
                </th>

                <th className="pb-3 text-right">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {dashboard.lastSales.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="p-8 text-center text-slate-500"
                  >
                    Sin ventas.
                  </td>

                </tr>

              ) : (

                dashboard.lastSales.map(
                  (sale: any) => (

                    <tr
                      key={sale.id}
                      className="border-b transition-colors duration-200 hover:bg-blue-50"
                    >

                      <td className="py-3 text-center">

                        <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-[#3C83F6]">

                          #{sale.id}

                        </span>

                      </td>

                      <td className="text-center">

                        {new Date(
                          sale.createdAt
                        ).toLocaleString("es-CL")}

                      </td>

                      <td className="text-right font-semibold">

                        $
                        {Number(
                          sale.total
                        ).toLocaleString("es-CL")}

                      </td>

                    </tr>

                  )

                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}