import { SalesHistoryFilters } from "../services/history.service";

export function buildSalesHistory(
  sales: any[],
  filters?: SalesHistoryFilters
) {

  let filteredSales = [...sales];

  /* ==========================
     Fecha inicio
  ========================== */

  if (filters?.startDate) {

    filteredSales = filteredSales.filter(
      sale =>
        new Date(sale.createdAt) >=
        filters.startDate!
    );

  }

  /* ==========================
     Fecha fin
  ========================== */

  if (filters?.endDate) {

    const end =
      new Date(filters.endDate);

    end.setHours(
      23,
      59,
      59,
      999
    );

    filteredSales = filteredSales.filter(
      sale =>
        new Date(sale.createdAt) <= end
    );

  }

  /* ==========================
     Sucursal
  ========================== */

  if (filters?.branchId) {

    filteredSales = filteredSales.filter(
      sale =>
        sale.branchId ===
        filters.branchId
    );

  }

  /* ==========================
     Usuario
  ========================== */

  if (filters?.userId) {

    filteredSales = filteredSales.filter(
      sale =>
        sale.userId ===
        filters.userId
    );

  }

  return filteredSales.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

}