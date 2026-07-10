"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CompanyLogo from "@/shared/components/CompanyLogo";

import {
  getCompanies,
} from "@/features/auth/services/auth.service";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
  getBranches,
} from "@/features/auth/services/auth.service";

import {
  getUsers,
} from "@/features/auth/services/auth.service";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

import {
  login as loginService,
} from "@/features/auth/services/auth.service";


export default function LoginPage() {

  const router = useRouter();

const {

  session,

  loading,

  login,

} = useSession();

useEffect(() => {

  if (

    !loading &&

    session

  ) {

    router.replace(

      "/dashboard"

    );

  }

}, [

  loading,

  session,

  router,

]);

  const [
    companies,
    setCompanies,
  ] = useState<any[]>([]);

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState<any>();

  const [
    branches,
    setBranches,
  ] = useState<any[]>([]);

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState<any>();

  const [
    users,
    setUsers,
  ] = useState<any[]>([]);

  const [
    selectedUser,
    setSelectedUser,
  ] = useState<any>();

  useEffect(() => {

    loadCompanies();

  }, []);

  async function loadCompanies() {

    const data =
      await getCompanies();

    setCompanies(data);

  }

  async function loadBranches(
    companyId: number
  ) {

    const data =
      await getBranches(companyId);

    setBranches(data);

  }

  async function loadUsers(
    companyId: number,
    branchId: number
  ) {

    const data =
      await getUsers(
        companyId,
        branchId
      );

    setUsers(data);

  }

  async function handleLogin() {

  if (
    !selectedCompany ||
    !selectedBranch ||
    !selectedUser
  ) {

    return;

  }

  try {

    const session =
      await loginService(
        selectedUser.id
      );

    login(session);

    router.replace(
      "/dashboard"
    );

  } catch {

    alert(
      "No fue posible iniciar sesión."
    );

  }

}

  useEffect(() => {

    if (!selectedCompany) {

      setBranches([]);
      return;

    }

    loadBranches(selectedCompany.id);

  }, [selectedCompany]);

  useEffect(() => {

    if (
      !selectedCompany ||
      !selectedBranch
    ) {

      setUsers([]);

      return;

    }

    loadUsers(
      selectedCompany.id,
      selectedBranch.id
    );

  }, [
    selectedCompany,
    selectedBranch,
  ]);

  if (loading) {

  return null;

}

  return (
    <div
      className="
    h-screen
    overflow-hidden

    flex
    items-center
    justify-center

    bg-gradient-to-br
    from-slate-100
    via-blue-50
    to-white

    p-6
  "
    >

      <Card
        className="
    h-fit
    w-full
    max-w-md
    rounded-3xl
    shadow-2xl
"
      >

        <CardHeader
          className="
        flex
        flex-col
        items-center
        text-center
        space-y-4
    "
        >

          <CompanyLogo

            company={
              selectedCompany?.name ??
              "QR Sales"
            }

            size={90}

          />

          <CardTitle
            className="mt-4 text-3xl"
          >
            QR Sales
          </CardTitle>

          <CardDescription>

            Sistema de ventas QR

          </CardDescription>

        </CardHeader>

        <CardContent
          className="
    flex
    flex-col
    gap-5
  "
        >

          <div className="w-full space-y-2">

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >

              Empresa

            </label>

            <Select
              onValueChange={(value) => {

                const company =
                  companies.find(
                    (c) => c.id === Number(value)
                  );

                setSelectedCompany(company);
                setSelectedBranch(undefined);

              }}

            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder="Seleccione una empresa"
                />

              </SelectTrigger>

              <SelectContent>

                {companies.map(
                  (company) => (

                    <SelectItem

                      key={company.id}

                      value={String(
                        company.id
                      )}

                    >

                      {company.name}

                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>

          </div>

          <div className="w-full space-y-2">

            <label
              className="
      block
      text-sm
      font-medium
    "
            >
              Sucursal
            </label>

            <Select
              disabled={
                !selectedCompany
              }
              value={
                selectedBranch
                  ? String(selectedBranch.id)
                  : undefined
              }
              onValueChange={(value) => {

                const branch =
                  branches.find(
                    (branch) =>
                      branch.id ===
                      Number(value)
                  );

                setSelectedBranch(branch);

                setSelectedUser(undefined);

                setUsers([]);

              }}
            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder="Seleccione una sucursal"
                />

              </SelectTrigger>

              <SelectContent>

                {branches.map(
                  (branch) => (

                    <SelectItem
                      key={branch.id}
                      value={String(branch.id)}
                    >

                      {branch.name}

                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>

          </div>

          <div className="w-full space-y-2">

            <label
              className="
      block
      text-sm
      font-medium
    "
            >
              Usuario
            </label>

            <Select

              disabled={
                !selectedBranch
              }

              value={
                selectedUser
                  ? String(selectedUser.id)
                  : undefined
              }

              onValueChange={(value) => {

                const user =
                  users.find(
                    (user) =>
                      user.id ===
                      Number(value)
                  );

                setSelectedUser(user);

              }}

            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder="Seleccione un usuario"
                />

              </SelectTrigger>

              <SelectContent>

                {users.map((user) => (

                  <SelectItem
                    key={user.id}
                    value={String(user.id)}
                  >

                    {user.name}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>

          <Button

            className="w-full"

            disabled={!selectedUser}

            onClick={handleLogin}

          >

            Ingresar

          </Button>

        </CardContent>

      </Card>

    </div>

  );

}