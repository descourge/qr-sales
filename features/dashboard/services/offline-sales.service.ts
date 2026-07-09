import {
  saveSales,
} from "@/shared/lib/offline-db";

export async function syncOfflineSales() {

  try {

    const response =
      await fetch(
        "/api/sales/all"
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