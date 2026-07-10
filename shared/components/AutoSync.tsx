"use client";

import { useEffect } from "react";

import { synchronizeSales } from "@/features/sync/services/sync.service";
import { notify } from "@/shared/lib/notify";
import { syncOfflineArticles } from "@/features/sales/services/article.service";

import { useSession } from "@/features/auth/context/SessionProvider";

export default function AutoSync() {

  const { session } = useSession();

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

        if (session) {

          await syncOfflineArticles(
            session.company.id
          );

        }

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