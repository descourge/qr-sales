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
    7,
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

          if (
  !db.objectStoreNames.contains(
    "branches"
  )
) {

  db.createObjectStore(
    "branches",
    {
      keyPath: "id",
    }
  );

}

if (
  !db.objectStoreNames.contains(
    "users"
  )
) {

  db.createObjectStore(
    "users",
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

/* ===========================================
   SUCURSALES OFFLINE
=========================================== */

export async function saveBranches(
  companyId: number,
  branches: any[]
) {

  const db =
    await getDatabase();

  const tx =
    db.transaction(
      "branches",
      "readwrite"
    );

  const store =
    tx.objectStore("branches");

  const current =
    await store.getAll();

  for (const branch of current) {

    if (
      branch.companyId ===
      companyId
    ) {

      await store.delete(
        branch.id
      );

    }

  }

  for (const branch of branches) {

    await store.put(branch);

  }

  await tx.done;

}

export async function getOfflineBranches(
  companyId: number
) {

  const db =
    await getDatabase();

  const branches =
    await db.getAll(
      "branches"
    );

  return branches.filter(

    branch =>

      branch.companyId ===
      companyId

  );

}

/* ===========================================
   USUARIOS OFFLINE
=========================================== */

export async function saveUsers(
  companyId: number,
  users: any[]
) {

  const db =
    await getDatabase();

  const tx =
    db.transaction(
      "users",
      "readwrite"
    );

  const store =
    tx.objectStore("users");

  const current =
    await store.getAll();

  for (const user of current) {

    if (
      user.companyId ===
      companyId
    ) {

      await store.delete(
        user.id
      );

    }

  }

  for (const user of users) {

    await store.put(user);

  }

  await tx.done;

}

export async function getOfflineUsers(
  companyId: number,
  branchId?: number
) {

  const db =
    await getDatabase();

  let users =
    await db.getAll(
      "users"
    );

  users =
    users.filter(

      user =>

        user.companyId ===
        companyId

    );

  if (branchId) {

    users =
      users.filter(

        user =>

          user.branchId ===
          branchId

      );

  }

  return users;

}