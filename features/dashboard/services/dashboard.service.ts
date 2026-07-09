import {
  getOfflineSales,
} from "@/shared/lib/offline-db";

import {
  buildDashboard,
} from "@/features/dashboard/lib/build-dashboard";

export type DashboardFilters = {
  startDate?: Date;
  endDate?: Date;
  category?: string;
};

export async function getDashboard(
  filters?: DashboardFilters
) {

  const params =
    new URLSearchParams();

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

  if (filters?.category) {

    params.set(
      "category",
      filters.category
    );

  }

  const url =
    `/api/dashboard${
      params.toString()
        ? `?${params.toString()}`
        : ""
    }`;

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