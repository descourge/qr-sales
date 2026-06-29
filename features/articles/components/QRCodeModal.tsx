"use client";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="print-area w-[420px] rounded-xl bg-white p-8 shadow-xl">

        <div className="mt-6 flex flex-col items-center">

            <h3 className="text-lg font-semibold">
            {description}
            </h3>

            <div className="my-6">
            <ArticleQRCode code={code} />
            <p className="mt-2 text-sm text-gray-600">
            Escanee este código para registrar la venta.
            </p>
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
            onClick={() => {
            setTimeout(() => {
                window.print();
            }, 100);
            }}
            >
            Imprimir
            </button>

        </div>

        </div>
    </div>
  );
}