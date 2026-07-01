"use client";

import { useEffect, useState } from "react";

import { Wifi, WifiOff } from "lucide-react";

import StatusBadge from "@/components/common/StatusBadge";

import { Download } from "lucide-react";

import {
  useInstallPWA,
} from "@/shared/providers/InstallPWAProvider";

export default function AppHeader() {
  const {
  canInstall,
  install,
} = useInstallPWA();

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function updateStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">

      <div>
        <h2 className="text-lg font-semibold">
          QR Sales
        </h2>
      </div>

      <div className="flex items-center gap-4">
{
  canInstall && (
    <button
      type="button"
      onClick={install}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      <Download size={18} />

      Instalar App
    </button>
  )
}

        <StatusBadge
          text={isOnline ? "En línea" : "Sin conexión"}
          color={isOnline ? "green" : "red"}
        />

        <div className="flex items-center gap-2">

          {isOnline ? (
            <Wifi
              size={18}
              className="text-green-600"
            />
          ) : (
            <WifiOff
              size={18}
              className="text-red-600"
            />
          )}

          <span className="text-sm">
            Usuario
          </span>

          <div className="h-9 w-9 rounded-full bg-primary" />

        </div>

      </div>

    </header>
  );
}