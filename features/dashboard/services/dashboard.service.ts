import {
  getOfflineDashboard,
  saveDashboard,
} from "@/shared/lib/offline-db";

export async function getDashboard() {

  if (!navigator.onLine) {

    return await getOfflineDashboard();

  }

  try {

    const response =
      await fetch("/api/dashboard");

    if (!response.ok) {
      throw new Error();
    }

    const dashboard =
      await response.json();

    await saveDashboard(
      dashboard
    );

    return dashboard;

  } catch {

    return await getOfflineDashboard();

  }

}

export async function syncOfflineDashboard() {
  try {
    const response = await fetch(
      "/api/dashboard"
    );

    if (!response.ok) return;

    const dashboard =
      await response.json();

    await saveDashboard(
      dashboard
    );

  } catch (error) {
    console.error(
      "No fue posible actualizar el dashboard offline.",
      error
    );
  }
}

export async function getDashboardByDate(date_ini?: Date, date_fin?: Date) {

    console.log("getDashboardByDate", date_ini, date_fin);

  if (!navigator.onLine) {

    return await getOfflineDashboard();

  }

  try {

    const response =
      await fetch("/api/dashboardDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date_ini, date_fin }),
      });

    if (!response.ok) {
      throw new Error();
    }

    const dashboard =
      await response.json();

    await saveDashboard(
      dashboard
    );

    return dashboard;

  } catch {

    return await getOfflineDashboard();

  }

}