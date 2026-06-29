"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/shared/constants/navigation";
import { APP_NAME } from "@/shared/constants/app";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          {APP_NAME}
        </h1>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2
                transition-colors

                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon size={18} />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}