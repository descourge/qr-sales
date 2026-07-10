"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

import AutoSync from "@/shared/components/AutoSync";

import {
  syncOfflineArticles,
} from "@/features/sales/services/article.service";

import {
  syncOfflineSales,
} from "@/features/dashboard/services/offline-sales.service";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const router =
    useRouter();

  const {

    session,

    loading,

  } = useSession();

  /* ==========================
     Sincronización Offline
  ========================== */

useEffect(() => {

  if (!session) {

    return;

  }

  const companyId =
    session.company.id;

  async function synchronizeOfflineData() {

    await Promise.all([

      syncOfflineArticles(
        companyId
      ),

      syncOfflineSales(),

    ]);

  }

  if (navigator.onLine) {

    synchronizeOfflineData();

  }

  function handleOnline() {

    synchronizeOfflineData();

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
  /* ==========================
     Validar sesión
  ========================== */

  useEffect(() => {

    if (loading) {

      return;

    }

    if (!session) {

      router.replace("/login");

    }

  }, [

    loading,

    session,

    router,

  ]);

  if (loading || !session) {

    return null;

  }

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Sidebar escritorio */}

      <div className="hidden lg:flex">

        <AppSidebar />

      </div>

      {/* Overlay */}

      {sidebarOpen && (

        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
        />

      )}

      {/* Sidebar móvil */}

      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          transform
          transition-transform
          duration-300
          lg:hidden
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <AppSidebar
          mobile
          onNavigate={() =>
            setSidebarOpen(false)
          }
        />

      </div>

      {/* Contenido */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >

        <AppHeader
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
        />

        <AutoSync />

        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            pt-24
            px-4
            pb-6
            sm:px-6
            lg:px-8
          "
        >

          {children}

        </main>

      </div>

    </div>

  );

}