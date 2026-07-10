"use client";

import { InstallPWAProvider } from "@/shared/providers/InstallPWAProvider";
import QueryProvider from "./QueryProvider";
import SessionProvider from "@/features/auth/context/SessionProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: Props) {
  return (
    <SessionProvider>
  <InstallPWAProvider>
    <QueryProvider>
      {children}
    </QueryProvider>
  </InstallPWAProvider>
  </SessionProvider>
  );
}