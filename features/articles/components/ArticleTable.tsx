"use client";

import { useState } from "react";

import { Article } from "@/shared/types/article";
import QRCodeModal from "./QRCodeModal";

import { toast } from "sonner";

import ConfirmDialog from "@/shared/components/ConfirmDialog";

import { notify } from "@/shared/lib/notify";

type Props = {
  articles: Article[];
  onReload: () => void;
};

export default function ArticleTable({
  articles,
  onReload,
}: Props) {
  const [openQR, setOpenQR] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<{
    code: string;
    description: string;
  } | null>(null);

  const [articleToDelete, setArticleToDelete] =
  useState<number | null>(null);

const [confirmOpen, setConfirmOpen] =
  useState(false);

async function deleteArticle() {
  if (articleToDelete === null) return;

  const response = await fetch(
    `/api/articles/${articleToDelete}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    notify.error("No fue posible eliminar el artículo.");
    return;
  }

  setConfirmOpen(false);

  setArticleToDelete(null);

  onReload();

  notify.success("Artículo eliminado.");
}

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-center">Código</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-center">Categoría</th>
              <th className="p-3 text-right">Precio</th>
              <th className="p-3 text-center">QR</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-slate-500"
                >
                  No existen artículos registrados.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t transition-colors hover:bg-slate-50"
                >
                  <td className="p-3 text-center font-mono">
                    {article.code}
                  </td>

                  <td className="p-3">
                    {article.description}
                  </td>

                  <td className="p-3 text-center">
                    {article.category}
                  </td>

                  <td className="p-3 text-right font-medium">
                    $
                    {Number(article.unitPrice).toLocaleString(
                      "es-CL"
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                      onClick={() => {
                        setSelectedArticle({
                          code: article.code,
                          description: article.description,
                        });

                        setOpenQR(true);
                      }}
                    >
                      Generar QR
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                      onClick={() => {
                        setArticleToDelete(article.id);
                        setConfirmOpen(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedArticle && (
        <QRCodeModal
          open={openQR}
          code={selectedArticle.code}
          description={selectedArticle.description}
          onClose={() => setOpenQR(false)}
        />
      )}

      <ConfirmDialog
  open={confirmOpen}
  title="Eliminar artículo"
  description="Esta acción eliminará el artículo de forma permanente."
  confirmText="Eliminar"
  cancelText="Cancelar"
  onConfirm={deleteArticle}
  onCancel={() => {
    setConfirmOpen(false);
    setArticleToDelete(null);
  }}
/>
    </>
  );
}