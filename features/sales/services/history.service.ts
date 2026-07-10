import {
  getOfflineSales,
} from "@/shared/lib/offline-db";

import {
  buildSalesHistory,
} from "@/features/sales/lib/build-sales-history";

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

  const url =
    `/api/sales/history?${params.toString()}`;

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    const sales =
      await getOfflineSales();

    return buildSalesHistory(
      sales,
      filters
    );

  }

  /* ==========================
     ONLINE
  ========================== */

  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error();

    }

    return await response.json();

  } catch {

    const sales =
      await getOfflineSales();

    return buildSalesHistory(
      sales,
      filters
    );

  }

}