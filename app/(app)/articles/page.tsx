import {
  Package,
  Boxes,
} from "lucide-react";

import ArticleManager from "@/features/articles/components/ArticleManager";

export default function ArticlesPage() {
  return (
    <div className="space-y-8">

      {/* Encabezado */}

      <div className="space-y-1">

        <div className="flex items-center gap-3">

          <Package
            size={30}
            className="text-[#3C83F6]"
          />

          <h1 className="text-4xl font-bold text-[#333333]">
            Gestión de artículos
          </h1>

        </div>

        <p className="text-slate-500">
          Administre el catálogo de productos disponibles para la venta.
        </p>

      </div>

      <ArticleManager />

    </div>
  );
}