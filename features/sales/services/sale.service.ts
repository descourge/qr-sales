export type SaveSaleItem = {
  articleId: number;
  quantity: number;
};

export type SaveSaleRequest = {

  companyId: number;

  branchId: number | null;

  userId: number;

  createdAt: string;

  latitude: number | null;

  longitude: number | null;

  total: number;

  items: SaveSaleItem[];

};

export async function saveSale(
  data: SaveSaleRequest
) {

  const response =
    await fetch(
      "/api/sales",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(data),

      }
    );

  if (!response.ok) {

    throw new Error(
      "No fue posible registrar la venta."
    );

  }

  return response.json();

}