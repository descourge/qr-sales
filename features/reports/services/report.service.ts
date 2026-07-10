import {
  getOfflineSales,
} from "@/shared/lib/offline-db";

import {
  buildReport,
} from "@/features/reports/lib/build-report";

import {
  SalesHistoryFilters,
} from "@/features/sales/services/history.service";

export async function getReport(
  companyId: number,
  filters?: SalesHistoryFilters
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
    `/api/reports?${params.toString()}`;

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    const sales =
      await getOfflineSales();

    return buildReport(
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

    return buildReport(
      sales,
      filters
    );

  }

}