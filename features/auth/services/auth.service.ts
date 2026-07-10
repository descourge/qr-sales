import {
  SessionData,
} from "../types";

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

  const response =
    await fetch(
      `/api/branches?companyId=${companyId}`
    );

  return response.json();

}

export async function getUsers(
  companyId: number,
  branchId: number
) {

  const response =
    await fetch(

      `/api/users?companyId=${companyId}&branchId=${branchId}`

    );

  return response.json();

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