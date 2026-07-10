import {
  SessionData,
} from "../types";

import {
  getOfflineBranches,
  getOfflineUsers,
  saveBranches,
  saveUsers,
} from "@/shared/lib/offline-db";

export async function getCompanies() {

  const response =
    await fetch(
      "/api/companies"
    );

  return response.json();

}

export async function getBranches(
  companyId: number
) {

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    return getOfflineBranches(
      companyId
    );

  }

  /* ==========================
     ONLINE
  ========================== */

  try {

    const response =
      await fetch(
        `/api/branches?companyId=${companyId}`
      );

    const branches =
      await response.json();

    await saveBranches(
      companyId,
      branches
    );

    return branches;

  } catch {

    return getOfflineBranches(
      companyId
    );

  }

}

export async function getUsers(
  companyId: number,
  branchId: number
) {

  /* ==========================
     OFFLINE
  ========================== */

  if (!navigator.onLine) {

    return getOfflineUsers(
      companyId,
      branchId
    );

  }

  /* ==========================
     ONLINE
  ========================== */

  try {

    const response =
      await fetch(
        `/api/users?companyId=${companyId}&branchId=${branchId}`
      );

    const users =
      await response.json();

    await saveUsers(
      companyId,
      users
    );

    return users;

  } catch {

    return getOfflineUsers(
      companyId,
      branchId
    );

  }

}

export async function login(
  userId: number
): Promise<SessionData> {

  const response =
    await fetch(

      "/api/login",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          userId,

        }),

      }

    );

  return response.json();

}