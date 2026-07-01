export async function getDashboard() {
  const response = await fetch(
    "/api/dashboard"
  );

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener el dashboard."
    );
  }

  return response.json();
}