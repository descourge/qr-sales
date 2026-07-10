import {
  getPendingSales,
  removePendingSale,
} from "@/shared/lib/offline-db";

import {
  saveSale,
} from "@/features/sales/services/sale.service";

import {
  notifyPendingSalesChanged,
} from "@/shared/lib/sync-events";

export async function synchronizeSales() {

  const pendingSales =
    await getPendingSales();

  let synchronized = 0;

  let failed = 0;

  for (const sale of pendingSales) {

    try {

      await saveSale({

        companyId:
          sale.companyId,

        branchId:
          sale.branchId,

        userId:
          sale.userId,

        createdAt:
          sale.createdAt,

        latitude:
          sale.latitude,

        longitude:
          sale.longitude,

        total:
          sale.total,

        items:
          sale.items,

      });

      await removePendingSale(
        sale.id
      );

      synchronized++;

    } catch (error) {

      console.error(
        "No fue posible sincronizar la venta:",
        sale.id,
        error
      );

      failed++;

      // Continuar con la siguiente venta

    }

  }

  notifyPendingSalesChanged();

  return {

    synchronized,

    failed,

    remaining:
      failed,

  };

}