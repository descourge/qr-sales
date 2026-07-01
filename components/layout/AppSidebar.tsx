"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/shared/constants/navigation";

type Props = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function AppSidebar({
  mobile = false,
  onNavigate,
}: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="
        flex
        h-screen
        w-72
        flex-col
        border-r
        border-gray-200
        bg-white
        shadow-lg
      "
    >
      {/* Logo */}

      <div className="border-b border-gray-200 p-6">

        <div className="flex items-center gap-4">

          <Image
            src="/logo.png"
            alt="QR Sales"
            width={46}
            height={46}
            priority
          />

          <div>

            <h2 className="text-xl font-bold text-[#3C83F6]">
              QR Sales
            </h2>

            <p className="text-sm text-slate-500">
              Menú principal
            </p>

          </div>

        </div>

      </div>

      {/* Navegación */}

      <nav className="flex-1 space-y-2 p-5">

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                group
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-[15px]
                font-medium
                transition-all
                duration-200

                ${
                  active
                    ? `
                        bg-[#3C83F6]
                        text-white
                        shadow-md
                      `
                    : `
                        text-[#333333]
                        hover:bg-blue-50
                        hover:text-[#3C83F6]
                      `
                }
              `}
            >
              <Icon
                size={21}
                strokeWidth={2}
              />

              <span className="flex-1">
                {item.title}
              </span>

            </Link>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-gray-200 p-5">

        <div className="rounded-xl bg-blue-50 p-4">

          <p className="text-sm font-semibold text-[#3C83F6]">
            QR Sales
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Versión 1.0
          </p>

          {mobile && (
            <p className="mt-3 text-xs text-slate-400">
              PWA
            </p>
          )}

        </div>

      </div>

    </aside>
  );
}