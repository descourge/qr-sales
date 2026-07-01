import { notify } from "@/shared/lib/notify";
import { saveArticles } from "@/shared/lib/offline-db";
import {
  getOfflineArticleByCode,
} from "@/shared/lib/offline-db";

export async function getArticleByCode(
  code: string
) {
  try {

    // Si no hay conexión, consultar directamente la copia local
    if (!navigator.onLine) {

      const article =
        await getOfflineArticleByCode(code);

      if (!article) {
        notify.warning(
          "El artículo no existe en la base de datos local."
        );
      }

      return article;
    }

    // Consultar la API
    const response = await fetch(
      `/api/articles/code/${code}`
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

    // Si la API falla por cualquier motivo,
    // intentar recuperar el artículo desde IndexedDB.
    const article =
      await getOfflineArticleByCode(code);

    if (article) {
      return article;
    }

    notify.error(
      "No fue posible consultar el artículo."
    );

    return null;
  }
}

export async function syncOfflineArticles() {
  try {
    const response = await fetch("/api/articles");

    if (!response.ok) return;

    const articles = await response.json();

    await saveArticles(articles);

  } catch (error) {
    console.error(
      "No fue posible actualizar los artículos offline.",
      error
    );
  }
}