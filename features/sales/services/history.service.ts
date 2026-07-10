import {
  getOfflineSales,
} from "@/shared/lib/offline-db";

export type SalesHistoryFilters = {

  startDate?: Date;

  endDate?: Date;

  branchId?: number;

  userId?: number;

};

export async function getSalesHistory(

  companyId: number,

  filters?: SalesHistoryFilters,

) {

  const params =
    new URLSearchParams();

  params.set(
    "companyId",
    String(companyId)
  );

  if (filters?.startDate) {

    params.set(
      "startDate",
      filters.startDate.toISOString()
    );

  }

  if (filters?.endDate) {

    params.set(
      "endDate",
      filters.endDate.toISOString()
    );

  }

  if (filters?.branchId) {

    params.set(
      "branchId",
      String(filters.branchId)
    );

  }

  if (filters?.userId) {

    params.set(
      "userId",
      String(filters.userId)
    );

  }

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    return filterOfflineSales(

      await getOfflineSales(),

      companyId,

      filters,

    );

  }

  /* ==========================
     ONLINE
  ========================== */

  try {

    const response =
      await fetch(
        `/api/sales/history?${params.toString()}`
      );

    if (!response.ok) {

      throw new Error();

    }

    return response.json();

  } catch {

    return filterOfflineSales(

      await getOfflineSales(),

      companyId,

      filters,

    );

  }

}

function filterOfflineSales(

  sales: any[],

  companyId: number,

  filters?: SalesHistoryFilters,

) {

  let result =
    sales.filter(

      sale =>

        sale.companyId === companyId

    );

  if (filters?.startDate) {

    result = result.filter(

      sale =>

        new Date(sale.createdAt) >=
        filters.startDate!

    );

  }

  if (filters?.endDate) {

    const end =
      new Date(filters.endDate);

    end.setHours(
      23,
      59,
      59,
      999
    );

    result = result.filter(

      sale =>

        new Date(sale.createdAt) <= end

    );

  }

  if (filters?.branchId) {

    result = result.filter(

      sale =>

        sale.branchId ===
        filters.branchId

    );

  }

  if (filters?.userId) {

    result = result.filter(

      sale =>

        sale.userId ===
        filters.userId

    );

  }

  return result;

}