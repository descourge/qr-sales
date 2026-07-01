import { notify } from "@/shared/lib/notify";

export async function getArticleByCode(
  code: string
) {
  if (!navigator.onLine) {
    notify.error(
      "No hay conexión a Internet. No es posible consultar artículos."
    );

    return null;
  }

  try {
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

    notify.error(
      "No fue posible consultar el artículo."
    );

    return null;
  }
}