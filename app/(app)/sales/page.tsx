"use client";

import { useState } from "react";

import QRScanner from "@/features/sales/components/QRScanner";
import ArticleCard from "@/features/sales/components/ArticleCard";

import { getArticleByCode } from "@/features/sales/services/article.service";

export default function SalesPage() {

  const [article, setArticle] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);

  async function handleDetected(code: string) {

    const result = await getArticleByCode(code);

    if (!result) {

      alert("Artículo no encontrado.");

      return;

    }

    setArticle(result);

  }

  function handleAdd() {

    console.log("Agregar al carrito");

  }

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold">

        Nueva Venta

      </h1>

      <QRScanner
        onDetected={handleDetected}
      />

      {article && (

        <ArticleCard

          article={article}

          quantity={quantity}

          onQuantityChange={setQuantity}

          onAdd={handleAdd}

        />

      )}

    </div>

  );

}