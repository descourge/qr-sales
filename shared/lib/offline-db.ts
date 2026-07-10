import { openDB } from "idb";

import { Article } from "@/shared/types/article";

async function getDatabase() {
  if (typeof window === "undefined") {
    throw new Error(
      "IndexedDB solo está disponible en el navegador."
    );
  }

  return openDB(
    "qr-sales-db",
    5,
    {
      upgrade(db) {

        if (
          !db.objectStoreNames.contains(
            "pendingSales"
          )
        ) {
          db.createObjectStore(
            "pendingSales",
            {
              keyPath: "id",
              autoIncrement: true,
            }
          );
        }

        if (
          !db.objectStoreNames.contains(
            "articles"
          )
        ) {
          db.createObjectStore(
            "articles",
            {
              keyPath: "id",
            }
          );
        }

        if (
            !db.objectStoreNames.contains(
                "dashboard"
            )
            ) {
            db.createObjectStore(
                "dashboard",
                {
                keyPath: "id",
                }
            );
            }

        if (
            !db.objectStoreNames.contains(
              "sales"
            )
          ) {
            db.createObjectStore(
              "sales",
              {
                keyPath: "id",
              }
            );
          }

      },
    }
  );
}

export async function saveSales(
  sales: any[]
) {

  const db =
    await getDatabase();

  const tx =
    db.transaction(
      "sales",
      "readwrite"
    );

  await tx
    .objectStore("sales")
    .clear();

  for (const sale of sales) {

    await tx
      .objectStore("sales")
      .put(sale);

  }

  await tx.done;

}

export async function getOfflineSales() {

  const db =
    await getDatabase();

  return db.getAll("sales");

}

export async function savePendingSale(
  sale: any
) {
  const db = await getDatabase();

  await db.add(
    "pendingSales",
    sale
  );
}

export async function getPendingSales() {
  const db = await getDatabase();

  return db.getAll(
    "pendingSales"
  );
}

export async function removePendingSale(
  id: number
) {
  const db = await getDatabase();

  await db.delete(
    "pendingSales",
    id
  );
}

export async function getPendingSalesCount() {
  const db = await getDatabase();

  return db.count(
    "pendingSales"
  );
}

/* ===========================================
   ARTÍCULOS OFFLINE
=========================================== */

export async function saveArticles(
  companyId: number,
  articles: Article[]
) {

  const db =
    await getDatabase();

  const tx =
    db.transaction(
      "articles",
      "readwrite"
    );

  const store =
    tx.objectStore("articles");

  const current =
    await store.getAll();

  for (const article of current) {

    if (
      article.companyId ===
      companyId
    ) {

      await store.delete(
        article.id
      );

    }

  }

  for (const article of articles) {

    await store.put(article);

  }

  await tx.done;

}

export async function getOfflineArticles(
  companyId: number
) {

  const db =
    await getDatabase();

  const articles =
    await db.getAll(
      "articles"
    );

  return articles.filter(

    article =>

      article.companyId ===
      companyId

  );

}

export async function getOfflineArticleByCode(
  companyId: number,
  code: string
) {

  const db =
    await getDatabase();

  const articles =
    await db.getAll(
      "articles"
    );

  return (

    articles.find(

      article =>

        article.companyId ===
          companyId &&

        article.code ===
          code

    ) ??

    null

  );

}