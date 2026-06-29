"use client";

import QueryProvider from "./QueryProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: Props) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}