"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Package,
  Tags,
  DollarSign,
  PackagePlus,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ArticleForm from "./ArticleForm";
import ArticleTable from "./ArticleTable";

import { Article } from "@/shared/types/article";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

import {
  getArticles,
} from "@/features/articles/services/article.service";

export default function ArticleManager() {

  const {
    session,
  } = useSession();

  const [
    articles,
    setArticles,
  ] = useState<Article[]>([]);

  const [
    open,
    setOpen,
  ] = useState(false);

  async function loadArticles(
    companyId: number
  ) {

    const data =
      await getArticles(
        companyId
      );

    setArticles(data);

  }

  useEffect(() => {

    if (!session) {

      return;

    }

    loadArticles(
      session.company.id
    );

  }, [session]);

  const categories =
    useMemo(() => {

      return new Set(

        articles.map(
          article =>
            article.category.id
        )

      ).size;

    }, [articles]);

  const averagePrice =
    useMemo(() => {

      if (
        articles.length === 0
      ) {

        return 0;

      }

      return (

        articles.reduce(

          (
            sum,
            article
          ) =>

            sum +
            Number(
              article.unitPrice
            ),

          0

        ) /

        articles.length

      );

    }, [articles]);

  return (

    <div className="space-y-8">

      {/* KPIs */}

      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <Package className="text-[#3C83F6]" />

            <div>

              <p className="text-sm text-slate-500">
                Productos
              </p>

              <p className="text-3xl font-bold">
                {articles.length}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <Tags className="text-[#F6BF1C]" />

            <div>

              <p className="text-sm text-slate-500">
                Categorías
              </p>

              <p className="text-3xl font-bold">
                {categories}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <DollarSign className="text-green-600" />

            <div>

              <p className="text-sm text-slate-500">
                Precio promedio
              </p>

              <p className="text-3xl font-bold">

                $

                {Math.round(
                  averagePrice
                ).toLocaleString(
                  "es-CL"
                )}

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Botón */}

      <div className="flex justify-end">

        <button

          type="button"

          onClick={() =>
            setOpen(true)
          }

          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#3C83F6]
            px-5
            py-3
            font-medium
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#2F6FD3]
            hover:shadow-md
          "

        >

          <PackagePlus size={18} />

          Nuevo artículo

        </button>

      </div>

      {/* Tabla */}

      <ArticleTable

        articles={articles}

        onReload={() => {

          if (session) {

            loadArticles(
              session.company.id
            );

          }

        }}

      />

      {/* Modal */}

      <Dialog

        open={open}

        onOpenChange={setOpen}

      >

        <DialogContent
          className="
            sm:max-w-2xl
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
          "
        >

          <DialogHeader>

            <DialogTitle className="flex items-center gap-2">

              <PackagePlus
                className="text-[#3C83F6]"
                size={22}
              />

              Nuevo artículo

            </DialogTitle>

          </DialogHeader>

          <ArticleForm

            onCreated={() => {

              if (session) {

                loadArticles(
                  session.company.id
                );

              }

              setOpen(false);

            }}

          />

        </DialogContent>

      </Dialog>

    </div>

  );

}