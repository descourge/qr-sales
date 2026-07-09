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
  articles: Article[]
) {
  const db = await getDatabase();

  const tx = db.transaction(
    "articles",
    "readwrite"
  );

  await tx.objectStore("articles").clear();

  for (const article of articles) {
    await tx.objectStore("articles").put(article);
  }

  await tx.done;
}

export async function getOfflineArticles() {
  const db = await getDatabase();

  return db.getAll("articles");
}

export async function getOfflineArticleByCode(
  code: string
) {
  const db = await getDatabase();

  const articles =
    await db.getAll("articles");

  return (
    articles.find(
      (article) =>
        article.code === code
    ) ?? null
  );
}