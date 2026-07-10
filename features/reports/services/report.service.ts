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

  const response =
    await fetch(
      `/api/reports?${params.toString()}`
    );

  return response.json();

}