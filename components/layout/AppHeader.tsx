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
import { useSession } from "@/features/auth/context/SessionProvider";

import CompanyLogo from "@/shared/components/CompanyLogo";

import { useRouter } from "next/navigation";

import {
  LogOut,
  Palette,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  detachPushSubscription,
} from "@/features/push/services/push-client.service";

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

    const {
  session,
  logout,
} = useSession();

const router = useRouter();

async function handleLogout() {
  const companyId =
    session?.company.id;

  const userId =
    session?.user.id;

  if (
    companyId &&
    userId
  ) {
    try {
      await detachPushSubscription(
        companyId,
        userId
      );
    } catch (error) {
      console.error(
        "[Push] No fue posible desvincular el dispositivo:",
        error
      );
    }
  }

  await Promise.resolve(
    logout()
  );

  router.replace(
    "/login"
  );
}

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
    fixed
    top-0
    left-0
    right-0

    lg:left-72

    z-40

    flex
    h-20
    items-center
    justify-between

    border-b
    border-gray-200

    bg-white/95
    backdrop-blur-md

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
      flex
      items-center
      justify-center
      rounded-xl
      bg-[#3C83F6]
      p-2.5
      text-white
      shadow
      transition-all
      duration-300
      hover:bg-[#2F6FD3]
      hover:shadow-lg
      sm:px-5
      sm:gap-2
    "
    title="Instalar aplicación"
  >
    <Download size={18} />

    <span className="hidden sm:inline">
      Instalar App
    </span>
  </button>
)}

        {/* Estado */}

<div
  className={`
    flex
    items-center
    gap-2
    rounded-full
    px-2
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

  {isOnline
    ? <Wifi size={16}/>
    : <WifiOff size={16}/>
  }

  <span className="hidden md:inline">
    {isOnline
      ? "En línea"
      : "Sin conexión"}
  </span>

</div>

{/* Usuario */}

<DropdownMenu>

  <DropdownMenuTrigger asChild>

    <button
      type="button"
      className="
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2

        transition-all
        duration-200

        hover:bg-slate-100
        active:scale-[0.98]
      "
    >

      {session && (

        <CompanyLogo
          company={session.company.name}
          size={40}
        />

      )}

      {/* Desktop */}

      <div className="hidden text-left lg:block">

        <p
          className="
            max-w-56
            truncate
            font-semibold
            text-[#333333]
          "
        >
          {session?.company.name}
        </p>

        <p className="text-xs text-slate-500">

          {session?.branch?.name}

        </p>

        <p className="text-xs text-slate-400">

          {session?.user.name}

        </p>

      </div>

      {/* Mobile */}

      <div
        className="
          flex
          flex-col
          text-left
          leading-tight
          lg:hidden
        "
      >

        <p
          className="
            max-w-28
            truncate
            text-sm
            font-semibold
            text-[#333333]
          "
        >
          {session?.branch?.name}
        </p>

        <p
          className="
            max-w-28
            truncate
            text-xs
            text-slate-500
          "
        >
          {session?.user.name}
        </p>

      </div>

      <ChevronDown
        size={16}
        className="text-slate-400"
      />

    </button>

  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-64"
  >

    <DropdownMenuLabel>

      <div className="space-y-1">

        <p className="font-semibold">

          {session?.company.name}

        </p>

        <p className="text-xs text-muted-foreground">

          {session?.branch?.name}

        </p>

        <p className="text-xs text-muted-foreground">

          {session?.user.name}

        </p>

      </div>

    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem disabled>

      <Palette className="mr-2 h-4 w-4" />

      Cambiar tema

      <span className="ml-auto text-xs text-slate-400">
        Próximamente
      </span>

    </DropdownMenuItem>

    <DropdownMenuSeparator />

   <DropdownMenuItem
  onClick={handleLogout}
  className="
    text-red-600
    focus:bg-red-50
    focus:text-red-700
    data-[highlighted]:bg-red-50
    data-[highlighted]:text-red-700
  "
>
  <LogOut className="mr-2 h-4 w-4" />
  Cerrar sesión
</DropdownMenuItem>

  </DropdownMenuContent>

</DropdownMenu>

      </div>

    </header>
  );
}