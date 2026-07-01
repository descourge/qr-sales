"use client";

import { InstallPWAProvider } from "@/shared/providers/InstallPWAProvider";
import QueryProvider from "./QueryProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: Props) {
  return (
  <InstallPWAProvider>
    <QueryProvider>
      {children}
    </QueryProvider>
  </InstallPWAProvider>
  );
}