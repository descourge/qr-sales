"use client";

import { useEffect, useState } from "react";

import {
  Download,
  Wifi,
  WifiOff,
  Menu,
} from "lucide-react";

import {
  useInstallPWA,
} from "@/shared/providers/InstallPWAProvider";

type Props = {
  onOpenSidebar: () => void;
};

export default function AppHeader({
  onOpenSidebar,
}: Props) {
  const {
    canInstall,
    install,
  } = useInstallPWA();

  const [isOnline, setIsOnline] =
    useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function updateStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener(
      "online",
      updateStatus
    );

    window.addEventListener(
      "offline",
      updateStatus
    );

    return () => {
      window.removeEventListener(
        "online",
        updateStatus
      );

      window.removeEventListener(
        "offline",
        updateStatus
      );
    };
  }, []);

  return (
    <header
      className="
        flex
        h-20
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white
        px-4
        shadow-sm
        sm:px-6
        lg:px-10
      "
    >
      {/* Lado izquierdo */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onOpenSidebar}
          className="
            rounded-xl
            p-2
            transition
            hover:bg-slate-100
            lg:hidden
          "
        >
          <Menu size={24} />
        </button>

      </div>

      {/* Lado derecho */}

      <div className="flex items-center gap-3 sm:gap-5">

        {/* Instalar */}

        {canInstall && (

          <button
            type="button"
            onClick={install}
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              bg-[#3C83F6]
              px-5
              py-2.5
              font-medium
              text-white
              shadow
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#2F6FD3]
              hover:shadow-lg
              md:flex
            "
          >
            <Download size={18} />

            Instalar App

          </button>

        )}

        {/* Estado */}

        <div
          className={`
            flex
            items-center
            gap-2
            rounded-full
            px-3
            py-2
            text-sm
            font-semibold

            ${
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {isOnline ? (
            <Wifi size={16} />
          ) : (
            <WifiOff size={16} />
          )}

          <span className="hidden sm:inline">

            {isOnline
              ? "En línea"
              : "Sin conexión"}

          </span>

        </div>

        {/* Usuario */}

        <div
          className="
            hidden
            items-center
            gap-3
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2
            shadow-sm
            md:flex
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#3C83F6]
              font-bold
              text-white
            "
          >
            U
          </div>

          <div>

            <p className="font-semibold text-[#333333]">
              Usuario
            </p>

            <p className="text-xs text-slate-500">
              Administrador
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}