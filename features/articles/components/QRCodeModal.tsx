"use client";

import { useRef } from "react";

import { toPng } from "html-to-image";

import ArticleQRCode from "./ArticleQRCode";

type Props = {
  open: boolean;
  code: string;
  description: string;
  onClose: () => void;
};

export default function QRCodeModal({
  open,
  code,
  description,
  onClose,
}: Props) {
  const qrRef =
    useRef<HTMLDivElement>(null);

  async function handlePrint() {
    if (!qrRef.current) return;

    try {
      const dataUrl = await toPng(
        qrRef.current,
        {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: "#FFFFFF",
        }
      );

      const printWindow = window.open(
        "",
        "_blank",
        "width=500,height=500"
      );

      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>

          <head>

            <title>Imprimir QR</title>

            <style>

              *{
                box-sizing:border-box;
              }

              html,
              body{
                margin:0;
                width:100%;
                height:100%;
              }

              body{
                display:flex;
                justify-content:center;
                align-items:center;
                background:white;
              }

              img{
                width:260px;
                height:auto;
              }

              @page{
                margin:0;
              }

            </style>

          </head>

          <body>

            <img src="${dataUrl}" />

          </body>

        </html>
      `);

      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error(
        "Error al imprimir el QR:",
        error
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-[420px] rounded-xl bg-white p-8 shadow-xl">

        <div className="mt-6 flex flex-col items-center">

          <h3 className="text-center text-lg font-semibold">
            {description}
          </h3>

          <div
            ref={qrRef}
            className="my-6 rounded-lg bg-white p-6"
          >
            <ArticleQRCode code={code} />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            className="rounded bg-slate-300 px-4 py-2"
            onClick={onClose}
          >
            Cerrar
          </button>

          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handlePrint}
          >
            Imprimir
          </button>

        </div>

      </div>

    </div>
  );
}