import { http } from "@/shared/lib/http";

import { Article } from "../types/article";

export async function getArticles() {
  return http<Article[]>("/api/articles");
}