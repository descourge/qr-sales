import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCcw,
  Settings,
  History,
  Receipt,
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
  title: "Historial de Ventas",
  href: "/sales/history",
  icon: Receipt,
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