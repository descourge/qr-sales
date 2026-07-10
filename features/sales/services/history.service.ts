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

  const response =
    await fetch(
      `/api/sales/history?${params.toString()}`
    );

  if (!response.ok) {

    throw new Error(
      "No fue posible obtener las ventas."
    );

  }

  return response.json();

}