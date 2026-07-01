import {
  getPendingSales,
  removePendingSale,
} from "@/shared/lib/offline-db";

import { saveSale } from "@/features/sales/services/sale.service";
import { notifyPendingSalesChanged } from "@/shared/lib/sync-events";

export async function synchronizeSales() {
  const pendingSales = await getPendingSales();

  let synchronized = 0;
  let failed = 0;

  for (const sale of pendingSales) {
    try {
      await saveSale({
        latitude: sale.latitude,
        longitude: sale.longitude,
        items: sale.items,
      });

      await removePendingSale(sale.id);

      synchronized++;

    } catch {
        
        failed++;
      break;
    }
  }

  notifyPendingSalesChanged();

  return {
    synchronized,
    failed,
    remaining: pendingSales.length - synchronized,
    };
}