"use client";

import { useEffect } from "react";

import { synchronizeSales } from "@/features/sync/services/sync.service";
import { notify } from "@/shared/lib/notify";
import { syncOfflineDashboard } from "@/features/dashboard/services/dashboard.service";
import { syncOfflineArticles } from "@/features/sales/services/article.service";

export default function AutoSync() {

  useEffect(() => {

    async function handleOnline() {

      const result =
        await synchronizeSales();

      if (result.synchronized > 0) {

        notify.success(
          `${result.synchronized} venta(s) sincronizada(s).`
        );

        window.dispatchEvent(
        new Event("sales-synchronized")
        );

        await Promise.all([
            syncOfflineArticles(),
            syncOfflineDashboard(),
        ]);

      }

    }

    window.addEventListener(
      "online",
      handleOnline
    );

    return () => {

      window.removeEventListener(
        "online",
        handleOnline
      );

    };

  }, []);

  return null;
}