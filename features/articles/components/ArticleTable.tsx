"use client";

import { useMemo, useState } from "react";

import {
  Search,
  QrCode,
  Trash2,
  Package,
} from "lucide-react";

import { Article } from "@/shared/types/article";

import QRCodeModal from "./QRCodeModal";

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
  const [search, setSearch] = useState("");

  const [openQR, setOpenQR] =
    useState(false);

  const [selectedArticle, setSelectedArticle] =
    useState<{
      code: string;
      description: string;
    } | null>(null);

  const [articleToDelete, setArticleToDelete] =
    useState<number | null>(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const filteredArticles = useMemo(() => {
    const value = search.toLowerCase();

    return articles.filter(
      (article) =>
        article.code
          .toLowerCase()
          .includes(value) ||
        article.description
          .toLowerCase()
          .includes(value) ||
        article.category
          .toLowerCase()
          .includes(value)
    );
  }, [articles, search]);

  async function deleteArticle() {
    if (articleToDelete === null) return;

    const response = await fetch(
      `/api/articles/${articleToDelete}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      notify.error(
        "No fue posible eliminar el artículo."
      );
      return;
    }

    setConfirmOpen(false);
    setArticleToDelete(null);

    onReload();

    notify.success("Artículo eliminado.");
  }

  return (
    <>
      <div className="space-y-5">

        {/* Buscador */}

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Buscar artículo..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-[#3C83F6]
              focus:ring-2
              focus:ring-[#3C83F6]/20
            "
          />

        </div>

        {/* Tabla */}

        <div
          className="
            overflow-x-auto
            overscroll-x-contain
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            [-webkit-overflow-scrolling:touch]
          "
        >

          <table className="min-w-[920px] w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Código
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Descripción
                </th>

                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Categoría
                </th>

                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Precio
                </th>

                <th className="px-5 py-4 text-center text-sm font-semibold">
                  QR
                </th>

                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredArticles.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-14"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <Package
                        size={42}
                        className="text-slate-300"
                      />

                      <p className="text-slate-500">
                        No existen artículos registrados.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredArticles.map((article) => (

                  <tr
                    key={article.id}
                    className="
                      border-t
                      transition-colors
                      hover:bg-slate-50
                    "
                  >

                    <td className="px-5 py-4 text-center font-mono">

                      {article.code}

                    </td>

                    <td className="px-5 py-4">

                      <div className="font-medium text-[#333333]">

                        {article.description}

                      </div>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <span
                        className="
                          rounded-full
                          bg-[#F6BF1C]/20
                          px-3
                          py-1
                          text-sm
                          font-medium
                          text-[#333333]
                        "
                      >

                        {article.category}

                      </span>

                    </td>

                    <td
                      className="
                        px-5
                        py-4
                        text-right
                        font-bold
                        text-[#3C83F6]
                      "
                    >

                      $
                      {Number(
                        article.unitPrice
                      ).toLocaleString("es-CL")}

                    </td>

                    <td className="px-5 py-4 text-center">

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArticle({
                            code: article.code,
                            description:
                              article.description,
                          });

                          setOpenQR(true);
                        }}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-[#3C83F6]
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-white
                          transition-all
                          duration-200
                          hover:bg-[#2F6FD3]
                          hover:shadow
                        "
                      >

                        <QrCode size={16} />

                        QR

                      </button>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <button
                        type="button"
                        onClick={() => {
                          setArticleToDelete(
                            article.id
                          );

                          setConfirmOpen(true);
                        }}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          p-2
                          text-red-600
                          transition
                          hover:bg-red-50
                        "
                      >

                        <Trash2 size={18} />

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {selectedArticle && (

        <QRCodeModal
          open={openQR}
          code={selectedArticle.code}
          description={
            selectedArticle.description
          }
          onClose={() =>
            setOpenQR(false)
          }
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