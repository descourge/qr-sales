"use client";

import { useState, useEffect } from "react";

import { getPendingSales } from "@/shared/lib/offline-db";
import { notify } from "@/shared/lib/notify";
import { synchronizeSales } from "@/features/sync/services/sync.service";
import { Clock3 } from "lucide-react";

export default function SyncPage() {

  const [pendingSales, setPendingSales] =
    useState<any[]>([]);

  const [isSyncing, setIsSyncing] =
    useState(false);

  useEffect(() => {
    loadPendingSales();
  }, []);

  useEffect(() => {
  function reload() {
    loadPendingSales();
  }

  window.addEventListener(
    "pending-sales-changed",
    reload
  );

  return () => {
    window.removeEventListener(
      "pending-sales-changed",
      reload
    );
  };
}, []);

  useEffect(() => {

  function reload() {

    loadPendingSales();

  }

  window.addEventListener(
    "storage",
    reload
  );

  return () => {

    window.removeEventListener(
      "storage",
      reload
    );

  };

}, []);

useEffect(() => {

  function reload() {

    loadPendingSales();

  }

  window.addEventListener(
    "sales-synchronized",
    reload
  );

  return () => {

    window.removeEventListener(
      "sales-synchronized",
      reload
    );

  };

}, []);

  async function loadPendingSales() {
    const sales = await getPendingSales();

    setPendingSales(sales);
  }

  async function handleSync() {
    setIsSyncing(true);

    try {
      const synchronized =
        await synchronizeSales();

      const result = await synchronizeSales();

            if (result.failed === 0) {

                notify.success(
                    `${result.synchronized} venta(s) sincronizada(s).`
                );

            } else {

                notify.warning(
                    `${result.synchronized} sincronizadas. ${result.remaining} pendientes.`
                );

            }

      await loadPendingSales();

    } catch {
      notify.error(
        "No fue posible sincronizar."
      );
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Sincronización
      </h1>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={
            isSyncing || pendingSales.length === 0
          }
          onClick={handleSync}
          className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSyncing
                ? "Sincronizando..."
                : `Sincronizar ahora (${pendingSales.length})`}
        </button>
      </div>

      <div className="space-y-4">

        {pendingSales.length === 0 ? (

          <div className="rounded-xl border bg-white p-8 text-center text-slate-500 shadow">
            No hay ventas pendientes de sincronización.
          </div>

        ) : (

          pendingSales.map((sale) => (

            <div
              key={sale.id}
              className="rounded-xl border bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold">
                    Venta local #{sale.id}
                  </p>

                  <p className="mt-3 text-sm">
                    {sale.items.reduce(
                        (sum: number, item: any) =>
                            sum + item.quantity,
                        0
                    )} artículos
                </p>

                  <p className="text-sm text-slate-500">
                    {new Date(sale.createdAt)
                    .toLocaleString("es-CL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                  </p>

                </div>

                <div className="flex items-center gap-2 text-yellow-700">

                    <Clock3 size={18}/>

                    <span>Pendiente</span>

                </div>

              </div>

              <p className="mt-3 text-sm">
                    {sale.items.reduce(
                        (sum: number, item: any) =>
                        sum + item.quantity,
                        0
                    )} artículo(s)
                    </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}