import {
  saveBranches,
  saveUsers,
} from "@/shared/lib/offline-db";

export async function syncOfflineBranches(
  companyId: number
) {

  try {

    const response =
      await fetch(
        `/api/branches?companyId=${companyId}`
      );

    if (!response.ok) {

      return;

    }

    const branches =
      await response.json();

    await saveBranches(

      companyId,

      branches

    );

  } catch (error) {

    console.error(

      "No fue posible sincronizar las sucursales.",

      error

    );

  }

}

export async function syncOfflineUsers(
  companyId: number
) {

  try {

    /* ==========================
       Obtener sucursales
    ========================== */

    const branchResponse =
      await fetch(
        `/api/branches?companyId=${companyId}`
      );

    if (!branchResponse.ok) {

      return;

    }

    const branches =
      await branchResponse.json();

    /* ==========================
       Obtener usuarios
    ========================== */

    let users: any[] = [];

    for (const branch of branches) {

      const response =
        await fetch(

          `/api/users?companyId=${companyId}&branchId=${branch.id}`

        );

      if (!response.ok) {

        continue;

      }

      const branchUsers =
        await response.json();

      users.push(

        ...branchUsers

      );

    }

    await saveUsers(

      companyId,

      users

    );

  } catch (error) {

    console.error(

      "No fue posible sincronizar los usuarios.",

      error

    );

  }

}