"use client";

import { useState } from "react";

import { Article } from "./ArticleManager";
import QRCodeModal from "./QRCodeModal";

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

  async function deleteArticle(id: number) {
    const ok = confirm("¿Eliminar artículo?");

    if (!ok) return;

    const response = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("No fue posible eliminar el artículo.");
      return;
    }

    onReload();
  }

  return (
    <>
      <table className="mt-6 w-full border">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-2">Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>QR</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-6 text-center text-gray-500"
              >
                No existen artículos registrados.
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="p-2">{article.code}</td>

                <td>{article.description}</td>

                <td>{article.category}</td>

                <td>
                  $
                  {Number(article.unitPrice).toLocaleString("es-CL")}
                </td>

                <td>
                  <button
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
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

                <td>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteArticle(article.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedArticle && (
        <QRCodeModal
          open={openQR}
          code={selectedArticle.code}
          description={selectedArticle.description}
          onClose={() => setOpenQR(false)}
        />
      )}
    </>
  );
}