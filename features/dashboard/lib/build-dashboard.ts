type DashboardFilters = {
  startDate?: Date;
  endDate?: Date;
  categoryId?: number;
};

export function buildDashboard(
  sales: any[],
  filters?: DashboardFilters
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
     Categoría
  ========================== */

  if (filters?.categoryId) {

    filteredSales = filteredSales.filter(
      sale =>
        sale.details.some(
          (detail: any) =>
            detail.article.categoryId ===
            filters.categoryId
        )
    );

  }

  /* ==========================
     KPIs
  ========================== */

  const salesCount =
    filteredSales.length;

  const totalSales =
    filteredSales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

  const averageSale =
    salesCount === 0
      ? 0
      : totalSales / salesCount;

  /* ==========================
     Artículos vendidos
  ========================== */

  const itemsSold =
    filteredSales.reduce(
      (sum, sale) =>
        sum +
        sale.details.reduce(
          (
            detailSum: number,
            detail: any
          ) =>
            detailSum +
            detail.quantity,
          0
        ),
      0
    );

  /* ==========================
     Productos más vendidos
  ========================== */

  const productMap =
    new Map<
      number,
      {
        articleId: number;
        code: string;
        description: string;
        category: string;
        quantity: number;
      }
    >();

  filteredSales.forEach(sale => {

    sale.details.forEach(
      (detail: any) => {

        const existing =
          productMap.get(
            detail.articleId
          );

        if (existing) {

          existing.quantity +=
            detail.quantity;

          return;

        }

        productMap.set(
          detail.articleId,
          {
            articleId:
              detail.articleId,

            code:
              detail.article.code,

            description:
              detail.article.description,

            category:
              detail.article.category.name,

            quantity:
              detail.quantity,
          }
        );

      }
    );

  });

  const topProducts =
    [...productMap.values()]
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )
      .slice(0, 5);

  /* ==========================
     Últimas ventas
  ========================== */

  const lastSales =
    [...filteredSales]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 10);

  return {

    salesCount,

    totalSales,

    averageSale,

    itemsSold,

    topProducts,

    lastSales,

  };

}