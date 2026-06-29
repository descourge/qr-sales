"use client";

import { Wifi } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";

export default function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">

      <div>
        <h2 className="text-lg font-semibold">
          QR Sales
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <StatusBadge
          text="En línea"
          color="green"
        />

        <div className="flex items-center gap-2">

          <Wifi size={18} />

          <span className="text-sm">
            Usuario
          </span>

          <div className="h-9 w-9 rounded-full bg-primary" />

        </div>

      </div>

    </header>
  );
}