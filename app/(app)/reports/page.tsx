"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { useSession } from "@/features/auth/context/SessionProvider";

import {
  getReport,
} from "@/features/reports/services/report.service";

import {
  ReportData,
} from "@/features/reports/types/report";

import ReportSummary from "@/features/reports/components/ReportSummary";

import BranchReportTable from "@/features/reports/components/BranchReportTable";

import SellerReportTable from "@/features/reports/components/SellerReportTable";

import ProductReportCards from "@/features/reports/components/ProductReportCards";

import ReportsSkeleton from "@/features/reports/components/ReportsSkeleton";

import EmptyReport from "@/features/reports/components/EmptyReport";

import {
  Button,
} from "@/components/ui/button";

import {
  SalesHistoryFilters,
} from "@/features/sales/services/history.service";

import {
  getBranches,
  getUsers,
} from "@/features/auth/services/auth.service";

import {
  SessionBranch,
  SessionUser,
} from "@/features/auth/types";

import { useRouter } from "next/navigation";

export default function ReportsPage() {

  const { session } =
    useSession();

    const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [report, setReport] =
    useState<ReportData>();

  const [branches, setBranches] =
    useState<SessionBranch[]>([]);

  const [users, setUsers] =
    useState<SessionUser[]>([]);

  const [filters, setFilters] =
    useState<SalesHistoryFilters>({});

    useEffect(() => {

  if (!session) {

    return;

  }

  const authorized =

    session.user.role === "ADMIN" ||

    session.user.role === "MANAGER";

  if (!authorized) {

    router.replace("/dashboard");

  }

}, [session, router]);

  useEffect(() => {

    if (!session) {

      return;

    }

    loadBranches();

    loadReport();

  }, [session]);

  async function loadBranches() {

    if (!session) {

      return;

    }

    const data =
      await getBranches(
        session.company.id
      );

    setBranches(data);

  }

  async function loadUsers(
    branchId: number
  ) {

    if (!session) {

      return;

    }

    const data =
      await getUsers(

        session.company.id,

        branchId

      );

    setUsers(data);

  }

  async function loadReport(

    currentFilters = filters

  ) {

    if (!session) {

      return;

    }

    setLoading(true);

    try {

      const data =
        await getReport(

          session.company.id,

          currentFilters

        );

      setReport(data);

    } finally {

      setLoading(false);

    }

  }

  if (

  session &&

  session.user.role !== "ADMIN" &&

  session.user.role !== "MANAGER"

) {

  return null;

}

  return (

    <div className="space-y-8">

      {/* Encabezado */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <BarChart3

              size={30}

              className="text-[#3C83F6]"

            />

            <h1 className="text-3xl font-bold">

              Reportes

            </h1>

          </div>

          <p className="mt-1 text-slate-500">

            Analice el rendimiento de ventas,
            vendedores, sucursales y productos.

          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
          >

            <FileText
              className="mr-2 h-4 w-4"
            />

            Exportar PDF

          </Button>

          <Button
            variant="outline"
          >

            <FileSpreadsheet
              className="mr-2 h-4 w-4"
            />

            Exportar Excel

          </Button>

        </div>

      </div>
{/* Filtros */}

<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <div
    className="
      grid
      gap-4
      lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]
    "
  >

    {/* Fecha inicio */}

    <input

      type="date"

      value={
        filters.startDate

          ? filters.startDate
              .toISOString()
              .split("T")[0]

          : ""

      }

      onChange={(e) =>

        setFilters({

          ...filters,

          startDate:

            e.target.value === ""

              ? undefined

              : new Date(e.target.value),

        })

      }

      className="
        h-11
        rounded-xl
        border
        border-gray-300
        px-4
      "

    />

    {/* Fecha fin */}

    <input

      type="date"

      value={
        filters.endDate

          ? filters.endDate
              .toISOString()
              .split("T")[0]

          : ""

      }

      onChange={(e) =>

        setFilters({

          ...filters,

          endDate:

            e.target.value === ""

              ? undefined

              : new Date(e.target.value),

        })

      }

      className="
        h-11
        rounded-xl
        border
        border-gray-300
        px-4
      "

    />

    {/* Sucursal */}

    <select

      value={

        filters.branchId ??

        ""

      }

      onChange={async (e) => {

        const value =

          Number(
            e.target.value
          );

        setUsers([]);

        setFilters({

          ...filters,

          branchId:

            value || undefined,

          userId:

            undefined,

        });

        if (value) {

          await loadUsers(
            value
          );

        }

      }}

      className="
        h-11
        rounded-xl
        border
        border-gray-300
        px-4
      "

    >

      <option value="">

        Todas las sucursales

      </option>

      {branches.map(

        branch => (

          <option

            key={branch.id}

            value={branch.id}

          >

            {branch.name}

          </option>

        )

      )}

    </select>

    {/* Vendedor */}

    <select

      value={

        filters.userId ??

        ""

      }

      disabled={
        !filters.branchId
      }

      onChange={(e) =>

        setFilters({

          ...filters,

          userId:

            Number(
              e.target.value
            ) || undefined,

        })

      }

      className="
        h-11
        rounded-xl
        border
        border-gray-300
        px-4
        disabled:opacity-50
      "

    >

      <option value="">

        Todos los vendedores

      </option>

      {users.map(

        user => (

          <option

            key={user.id}

            value={user.id}

          >

            {user.name}

          </option>

        )

      )}

    </select>

    <Button

      onClick={() =>

        loadReport(filters)

      }

    >

      Generar reporte

    </Button>

    <Button

      variant="outline"

      onClick={() => {

        setUsers([]);

        setFilters({});

        loadReport({});

      }}

    >

      Limpiar

    </Button>

  </div>

</div>

{loading ? (

  <ReportsSkeleton />

) : !report ||

report.summary.totalSales === 0 ? (

  <EmptyReport />

) : (

  <>
  <ReportSummary

  summary={report.summary}

/>
<div className="mt-8">

  <h2
    className="
      mb-4
      text-xl
      font-semibold
    "
  >

    Comparación entre sucursales

  </h2>

  <BranchReportTable

    branches={report.branches}

  />

</div>
<div className="mt-10">

  <h2
    className="
      mb-4
      text-xl
      font-semibold
    "
  >

    Ranking de vendedores

  </h2>

  <SellerReportTable

    sellers={report.sellers}

  />

</div>
<div className="mt-10">

  <h2
    className="
      mb-4
      text-xl
      font-semibold
    "
  >

    Productos más vendidos

  </h2>

  <ProductReportCards

    products={report.products}

  />

</div>
  </>

)}

</div>

);
}