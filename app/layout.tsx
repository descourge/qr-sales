import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import ServiceWorkerRegister from "@/shared/components/ServiceWorkerRegister";

const roboto = Roboto({
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "700",
  ],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "QR Sales",
  description: "Sistema de ventas mediante códigos QR.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} h-full`}
    >
      <body>
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}