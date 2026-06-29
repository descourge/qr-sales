import { useEffect, useState } from "react";

import { getArticles } from "../services/article.service";

import { Article } from "../types/article";

export function useArticles() {
  const [articles, setArticles] =
    useState<Article[]>([]);

  async function loadArticles() {
    const data = await getArticles();

    setArticles(data);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    reload: loadArticles,
  };
}