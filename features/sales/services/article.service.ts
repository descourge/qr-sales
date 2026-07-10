import { notify } from "@/shared/lib/notify";

import {
  saveArticles,
  getOfflineArticleByCode,
} from "@/shared/lib/offline-db";

import { Article } from "@/shared/types/article";

export async function getArticleByCode(
  companyId: number,
  code: string
): Promise<Article | null> {

  try {

    /* ==========================
       OFFLINE
    ========================== */

    if (!navigator.onLine) {

      const article =
        await getOfflineArticleByCode(
          companyId,
          code
        );

      if (!article) {

        notify.warning(
          "El artículo no existe en la base de datos local."
        );

      }

      return article;

    }

    /* ==========================
       ONLINE
    ========================== */

    const response =
      await fetch(

        `/api/articles/code/${code}?companyId=${companyId}`

      );

    if (response.status === 404) {

      notify.warning(
        "No existe ningún artículo asociado al código QR escaneado."
      );

      return null;

    }

    if (!response.ok) {

      notify.error(
        "No fue posible consultar el artículo."
      );

      return null;

    }

    return await response.json();

  } catch (error) {

    console.error(error);

    const article =
      await getOfflineArticleByCode(
        companyId,
        code
      );

    if (article) {

      return article;

    }

    notify.error(
      "No fue posible consultar el artículo."
    );

    return null;

  }

}

export async function syncOfflineArticles(
  companyId: number
) {

  try {

    const response =
      await fetch(

        `/api/articles?companyId=${companyId}`

      );

    if (!response.ok) {

      return;

    }

    const articles =
      await response.json();

    await saveArticles(
      companyId,
      articles
    );

  } catch (error) {

    console.error(

      "No fue posible actualizar los artículos offline.",

      error

    );

  }

}