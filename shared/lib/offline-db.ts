import { openDB } from "idb";

async function getDatabase() {
  if (typeof window === "undefined") {
    throw new Error(
      "IndexedDB solo está disponible en el navegador."
    );
  }

  return openDB(
    "qr-sales-db",
    1,
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
      },
    }
  );
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