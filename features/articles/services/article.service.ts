import { http } from "@/shared/lib/http";

import { Article } from "@/shared/types/article";

export async function getArticles(
  companyId: number
) {

  return http<Article[]>(

    `/api/articles?companyId=${companyId}`

  );

}

export async function createArticle(
  data: {
    companyId: number;
    categoryId: number;
    code: string;
    description: string;
    unitPrice: number;
  }
) {

  const response =
    await fetch(
      "/api/articles",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      }
    );

  if (!response.ok) {

    throw new Error();

  }

  return response.json();

}