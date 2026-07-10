import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCcw,
  Settings,
  History,
  Receipt,
  FileBarChart2,
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
    title: "Reportes",
    href: "/reports",
    icon: FileBarChart2,
  }
];