export async function getSalesHistory() {

  const response = await fetch(
    "/api/sales/history"
  );

  if (!response.ok) {
    throw new Error("No fue posible obtener las ventas.");
  }

  return response.json();
}