"use client";

import { useEffect, useState } from "react";

import ArticleForm from "./ArticleForm";
import ArticleTable from "./ArticleTable";

import { Article } from "@/shared/types/article";

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);

  async function loadArticles() {
    const response = await fetch("/api/articles");
    const data = await response.json();

    setArticles(data);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div className="space-y-8">
      <ArticleForm onCreated={loadArticles} />

      <ArticleTable
        articles={articles}
        onReload={loadArticles}
      />
    </div>
  );
}