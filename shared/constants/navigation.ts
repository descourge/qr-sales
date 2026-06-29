import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCcw,
  Settings,
} from "lucide-react";

import { NavigationItem } from "@/shared/types/navigation";

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Artículos",
    href: "/articles",
    icon: Package,
  },
  {
    title: "Ventas",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Sincronización",
    href: "/sync",
    icon: RefreshCcw,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];