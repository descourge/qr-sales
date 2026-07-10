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

import { useSession } from "@/features/auth/context/SessionProvider";

import {
  SalesHistoryFilters,
} from "@/features/sales/services/history.service";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
  Calendar as CalendarIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getBranches,
  getUsers,
} from "@/features/auth/services/auth.service";

import {
  SessionBranch,
  SessionUser,
} from "@/features/auth/types";

import { es } from "date-fns/locale";

export default function SalesHistoryPage() {
  
  const [sales, setSales] =
    useState<SaleHistory[]>([]);

  const [loading, setLoading] =
    useState(true);

    const [branches, setBranches] =
  useState<SessionBranch[]>([]);

  const [users, setUsers] =
  useState<SessionUser[]>([]);

    const [filters, setFilters] =
  useState<SalesHistoryFilters>({});

const [appliedFilters, setAppliedFilters] =
  useState<SalesHistoryFilters>({});

  const [search, setSearch] =
    useState("");

  const [selectedSale, setSelectedSale] =
    useState<SaleHistory | null>(null);

  const [open, setOpen] =
    useState(false);

    const {
  session,
} = useSession();

useEffect(() => {

  if (!session) {

    return;

  }

  loadSales(
    session.company.id
  );

  loadBranches(
    session.company.id
  );

}, [session]);

async function loadUsers(
  companyId: number,
  branchId: number
) {

  try {

    const data =
      await getUsers(
        companyId,
        branchId
      );

    setUsers(data);

  } catch (error) {

    console.error(error);

  }

}

async function loadSales(

  companyId: number,

  currentFilters = filters,

) {

  setLoading(true);

  try {

    const data =
      await getSalesHistory(

        companyId,

        currentFilters,

      );

    setSales(data);

  } finally {

    setLoading(false);

  }

}

async function loadBranches(
  companyId: number
) {

  try {

    const data =
      await getBranches(
        companyId
      );

    setBranches(data);

  } catch (error) {

    console.error(error);

  }

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

  const salesWithLocation =
  useMemo(() => {

    if (sales.length === 0) {

      return 0;

    }

    return Math.round(

      sales.filter(

        sale =>

          sale.latitude !== null &&

          sale.longitude !== null

      ).length /

      sales.length *

      100

    );

  }, [sales]);

  console.log(
  "Offline sales:",
  sales
);

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

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <div
    className="
      grid
      gap-4
      lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]
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
            ? format(
                filters.startDate,
                "dd/MM/yyyy"
              )
            : "Fecha inicio"}

        </Button>

      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">

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
            ? format(
                filters.endDate,
                "dd/MM/yyyy"
              )
            : "Fecha fin"}

        </Button>

      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">

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

<Select
value={
  filters.branchId
    ? String(filters.branchId)
    : "0"
}
onValueChange={async (value) => {

  const branchId =
    value === "0"
      ? undefined
      : Number(value);

  setFilters({

    ...filters,

    branchId,

    userId: undefined,

  });

  setUsers([]);

  if (
    session &&
    branchId
  ) {

    await loadUsers(

      session.company.id,

      branchId,

    );

  }

}}
>

<SelectTrigger
  className="
    h-11
    w-full
    rounded-xl
    border-gray-300
    bg-white
    px-4
    transition-all
    duration-200
    hover:border-[#3C83F6]
    focus:ring-2
    focus:ring-[#3C83F6]/20
    data-[state=open]:border-[#3C83F6]
    disabled:opacity-60
  "
>

    <SelectValue
      placeholder="Todas las sucursales"
    />

  </SelectTrigger>

<SelectContent
  className="
    rounded-xl
    border-gray-200
    min-w-[var(--radix-select-trigger-width)]
  "
>

    <SelectItem value="0">

      Todas las sucursales

    </SelectItem>

    {branches.map((branch) => (

      <SelectItem
        key={branch.id}
        value={String(branch.id)}
      >

        {branch.name}

      </SelectItem>

    ))}

  </SelectContent>

</Select>

<Select

  value={
    filters.userId
      ? String(filters.userId)
      : "0"
  }

  disabled={
    !filters.branchId
  }

  onValueChange={(value) =>

    setFilters({

      ...filters,

      userId:
        value === "0"
          ? undefined
          : Number(value),

    })

  }

>

<SelectTrigger
  className="
    h-11
    w-full
    rounded-xl
    border-gray-300
    bg-white
    px-4
    transition-all
    duration-200
    hover:border-[#3C83F6]
    focus:ring-2
    focus:ring-[#3C83F6]/20
    data-[state=open]:border-[#3C83F6]
    disabled:opacity-60
  "
>

    <SelectValue
      placeholder="Todos los vendedores"
    />

  </SelectTrigger>

<SelectContent
  className="
    rounded-xl
    border-gray-200
    min-w-[var(--radix-select-trigger-width)]
  "
>

    <SelectItem value="0">

      Todos los vendedores

    </SelectItem>

    {users.map(user => (

      <SelectItem

        key={user.id}

        value={String(user.id)}

      >

        {user.name}

      </SelectItem>

    ))}

  </SelectContent>

</Select>

    <Button

      onClick={() => {

        if (!session) {

          return;

        }

        setAppliedFilters(filters);

        loadSales(

          session.company.id,

          filters,

        );

      }}

    >

      Aplicar filtros

    </Button>

    <Button

      variant="outline"

      onClick={() => {

        const empty = {};

setUsers([]);

setFilters(empty);

setAppliedFilters(empty);

        if (session) {

          loadSales(

            session.company.id,

            empty,

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

  {appliedFilters.startDate ||
  appliedFilters.endDate ? (

    <>

      {appliedFilters.startDate
        ? format(
            appliedFilters.startDate,
            "dd/MM/yyyy"
          )
        : "Inicio"}

      {" — "}

      {appliedFilters.endDate
        ? format(
            appliedFilters.endDate,
            "dd/MM/yyyy"
          )
        : "Hoy"}

    </>

  ) : (

    "Todas las ventas"

  )}

  {appliedFilters.branchId && (

    <>

      {" · "}

      Sucursal:

      <span className="font-semibold">

        {" "}

        {
          branches.find(
            (branch) =>
              branch.id ===
              appliedFilters.branchId
          )?.name
        }

      </span>

    </>

  )}

  {appliedFilters.userId && (

  <>

    {" · "}

    Vendedor:

    <span className="font-semibold">

      {" "}

      {
        users.find(

          user =>

            user.id ===
            appliedFilters.userId

        )?.name
      }

    </span>

  </>

)}

</span>

  </div>

</div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">

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

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

  <div className="flex items-center gap-3">

    <MapPin className="text-green-600" />

    <div>

      <p className="text-sm text-slate-500">

        Con ubicación

      </p>

      <p className="text-3xl font-bold">

        {salesWithLocation}%

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

        <table className="min-w-[1100px] w-full">

          <thead className="bg-slate-50">

            <tr>

  <th className="px-5 py-4 text-center text-sm font-semibold">
    Venta
  </th>

  <th className="px-5 py-4 text-center text-sm font-semibold">
    Fecha
  </th>

  <th className="px-5 py-4 text-left text-sm font-semibold">
    Vendedor
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
                    colSpan={7}
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

filteredSales.map((sale) => {

  const totalProducts =
    sale.details.reduce(
      (sum, detail) =>
        sum + detail.quantity,
      0
    );

  return (

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

  <div>

    <div className="font-medium">

      {format(
        new Date(sale.createdAt),
        "dd MMM yyyy",
        {
          locale: es,
        }
      )}

    </div>

    <div className="text-xs text-slate-500">

      {format(
        new Date(sale.createdAt),
        "HH:mm"
      )}

    </div>

  </div>

</td>

<td className="px-5 py-4">

  <div className="flex flex-col">

    <span className="font-medium">

      {sale.user.name}

    </span>

    <span className="text-xs text-slate-500">

      {sale.branch.name}

    </span>

  </div>

</td>

<td className="px-5 py-4 text-center">

  <div className="flex flex-col items-center">

    <span className="text-lg font-semibold">

      {totalProducts}

    </span>

    <span className="text-xs text-slate-500">

      {sale.details.length} tipos

    </span>

  </div>

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

  );

})

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