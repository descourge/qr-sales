import {
  getOfflineSales,
} from "@/shared/lib/offline-db";

import {
  buildDashboard,
} from "@/features/dashboard/lib/build-dashboard";

export type DashboardFilters = {
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
};

export async function getDashboard(
  companyId: number,
  filters?: DashboardFilters
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

  if (filters?.categoryId) {

    params.set(
      "categoryId",
      String(filters.categoryId)
    );

  }

  const url =
    `/api/dashboard?${params.toString()}`;

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    const sales =
      await getOfflineSales();

    return buildDashboard(
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

    return buildDashboard(
      sales,
      filters
    );

  }

}