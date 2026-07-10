"use client";

import { useEffect } from "react";

import {
  synchronizeSales,
} from "@/features/sync/services/sync.service";

import {
  notify,
} from "@/shared/lib/notify";

import {
  syncOfflineArticles,
} from "@/features/sales/services/article.service";

import {
  syncOfflineSales,
} from "@/features/dashboard/services/offline-sales.service";

import {
  syncOfflineBranches,
  syncOfflineUsers,
} from "@/features/auth/services/offline-auth.service";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

export default function AutoSync() {

  const {
    session,
  } = useSession();

useEffect(() => {

  if (!session) {

    return;

  }

  const companyId =
    session.company.id;

  async function handleOnline() {

    const result =
      await synchronizeSales();

    if (result.synchronized > 0) {

      notify.success(
        `${result.synchronized} venta(s) sincronizada(s).`
      );

    }

    window.dispatchEvent(
      new Event("sales-synchronized")
    );

    await Promise.all([

      syncOfflineArticles(
        companyId
      ),

      syncOfflineSales(
  companyId
),

      syncOfflineBranches(
        companyId
      ),

      syncOfflineUsers(
        companyId
      ),

    ]);

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

}, [session]);

  return null;

}