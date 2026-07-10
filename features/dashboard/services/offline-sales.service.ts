import {
  saveSales,
} from "@/shared/lib/offline-db";

export async function syncOfflineSales(companyId: number) {

  try {

    const response =
      await fetch(
  `/api/sales/all?companyId=${companyId}`
);

    if (!response.ok) {

      return;

    }

    const sales =
      await response.json();

    await saveSales(
      sales
    );

  } catch (error) {

    console.error(
      "No fue posible sincronizar las ventas.",
      error
    );

  }

}