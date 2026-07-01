"use client";

import { useState } from "react";

import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

import AutoSync from "@/shared/components/AutoSync";

import { useEffect} from "react";

import { syncOfflineArticles } from "@/features/sales/services/article.service";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

    useEffect(() => {
  if (navigator.onLine) {
    syncOfflineArticles();
  }

  function handleOnline() {
    syncOfflineArticles();
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

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50">

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
            min-w-0
            flex-1
            overflow-x-hidden
            p-4
            sm:p-6
            lg:p-8
          "
        >

          {children}

        </main>

      </div>

    </div>
  );
}