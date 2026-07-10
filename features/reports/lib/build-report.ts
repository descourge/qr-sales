import { ReportData } from "../types/report";
import { SalesHistoryFilters } from "@/features/sales/services/history.service";

export function buildReport(
  sales: any[],
  filters?: SalesHistoryFilters
): ReportData {

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

  /* ==========================
     Resumen
  ========================== */

  const totalSales =
    filteredSales.length;

  const totalAmount =
    filteredSales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

  const averageTicket =
    totalSales === 0
      ? 0
      : totalAmount / totalSales;

  /* ==========================
     Sucursales
  ========================== */

  const branchMap =
    new Map<number, any>();

  filteredSales.forEach(sale => {

    const existing =
      branchMap.get(sale.branch.id);

    if (existing) {

      existing.sales++;

      existing.total +=
        Number(sale.total);

    } else {

      branchMap.set(
        sale.branch.id,
        {
          id: sale.branch.id,
          name: sale.branch.name,
          sales: 1,
          total: Number(sale.total),
        }
      );

    }

  });

  /* ==========================
     Vendedores
  ========================== */

  const sellerMap =
    new Map<number, any>();

  filteredSales.forEach(sale => {

    const existing =
      sellerMap.get(sale.user.id);

    if (existing) {

      existing.sales++;

      existing.total +=
        Number(sale.total);

    } else {

      sellerMap.set(
        sale.user.id,
        {
          id: sale.user.id,
          name: sale.user.name,
          branch: sale.branch.name,
          sales: 1,
          total: Number(sale.total),
        }
      );

    }

  });

  /* ==========================
     Productos
  ========================== */

  const productMap =
    new Map<number, any>();

  filteredSales.forEach(sale => {

    sale.details.forEach(
      (detail: any) => {

        const existing =
          productMap.get(
            detail.article.id
          );

        if (existing) {

          existing.quantity +=
            detail.quantity;

          existing.total +=
            Number(detail.subtotal);

        } else {

          productMap.set(
            detail.article.id,
            {
              id: detail.article.id,
              name: detail.article.description,
              quantity: detail.quantity,
              total: Number(detail.subtotal),
            }
          );

        }

      }
    );

  });

  return {

    summary: {

      totalSales,

      totalAmount,

      averageTicket,

    },

    branches:
      [...branchMap.values()]
        .sort(
          (a, b) =>
            b.total - a.total
        ),

    sellers:
      [...sellerMap.values()]
        .sort(
          (a, b) =>
            b.total - a.total
        ),

    products:
      [...productMap.values()]
        .sort(
          (a, b) =>
            b.quantity - a.quantity
        ),

  };

}