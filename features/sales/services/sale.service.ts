export type SaveSaleItem = {
  articleId: number;
  quantity: number;
};

type SaveSaleRequest = {
  latitude: number | null;
  longitude: number | null;
  items: SaveSaleItem[];
};

export async function saveSale(data: SaveSaleRequest) {
  const response = await fetch("/api/sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No fue posible registrar la venta.");
  }

  return response.json();
}