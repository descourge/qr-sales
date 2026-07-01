"use client";

import ArticleQRCode from "./ArticleQRCode";

type Props = {
  open: boolean;
  code: string;
  description: string;
  onClose: () => void;
};

function handlePrint() {
  const svg = document.querySelector(
    ".qr-print svg"
  ) as SVGSVGElement | null;

  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const svgBlob = new Blob([source], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  const img = new Image();

  img.onload = () => {
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
          <title>QR</title>

          <style>
            html,
            body{
              margin:0;
              display:flex;
              justify-content:center;
              align-items:center;
              height:100vh;
            }

            img{
              width:260px;
              height:260px;
            }

            @page{
              margin:0;
            }
          </style>

        </head>

        <body>

          <img src="${img.src}" />

        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

export default function QRCodeModal({
  open,
  code,
  description,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="print-area w-[420px] rounded-xl bg-white p-8 shadow-xl">

        <div className="mt-6 flex flex-col items-center">

            <h3 className="text-lg font-semibold">
            {description}
            </h3>

            <div className="my-6 print-content">
            <ArticleQRCode code={code} />
            </div>
            

        </div>

        <div className="no-print mt-8 flex justify-end gap-3">

            <button
            className="rounded bg-slate-300 px-4 py-2"
            onClick={onClose}
            >
            Cerrar
            </button>

            <button
  className="rounded bg-blue-600 px-4 py-2 text-white"
  onClick={handlePrint}
>
  Imprimir
</button>

        </div>

        </div>
    </div>
  );
}