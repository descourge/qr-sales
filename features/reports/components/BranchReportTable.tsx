"use client";

import {
  Trophy,
  Store,
} from "lucide-react";

import {
  BranchReport,
} from "../types/report";

interface Props {

  branches: BranchReport[];

}

export default function BranchReportTable({

  branches,

}: Props) {

  const maxTotal =

    branches.length > 0

      ? Math.max(
          ...branches.map(
            branch => branch.total
          )
        )

      : 0;

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          px-6
          py-4
        "
      >

        <Store
          className="text-[#3C83F6]"
        />

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >

            Ventas por sucursal

          </h2>

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Comparación entre todas las sucursales.

          </p>

        </div>

      </div>

      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            w-full
          "
        >

          <thead
            className="
              bg-slate-50
            "
          >

            <tr>

              <th
                className="
                  px-6
                  py-4
                  text-center
                  text-sm
                  font-semibold
                "
              >

                #

              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                "
              >

                Sucursal

              </th>

              <th
                className="
                  px-6
                  py-4
                  text-center
                  text-sm
                  font-semibold
                "
              >

                Ventas

              </th>

              <th
                className="
                  px-6
                  py-4
                  text-right
                  text-sm
                  font-semibold
                "
              >

                Total

              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                "
              >

                Participación

              </th>

            </tr>

          </thead>

          <tbody>

            {branches.map(

              (
                branch,
                index
              ) => {

                const percentage =

                  maxTotal === 0

                    ? 0

                    : (

                        branch.total /

                        maxTotal

                      ) * 100;

                return (

                  <tr

                    key={branch.id}

                    className="
                      border-t
                      hover:bg-slate-50
                      transition-colors
                    "

                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-center
                      "
                    >

                      {index === 0 && "🥇"}

                      {index === 1 && "🥈"}

                      {index === 2 && "🥉"}

                      {index > 2 &&
                        index + 1}

                    </td>

                    <td
                      className="
                        px-6
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        {index === 0 && (

                          <Trophy
                            size={16}
                            className="
                              text-yellow-500
                            "
                          />

                        )}

                        <span
                          className="
                            font-medium
                          "
                        >

                          {branch.name}

                        </span>

                      </div>

                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-center
                      "
                    >

                      {branch.sales}

                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                        font-semibold
                        text-[#3C83F6]
                      "
                    >

                      $

                      {Math.round(
                        branch.total
                      ).toLocaleString(
                        "es-CL"
                      )}

                    </td>

                    <td
                      className="
                        px-6
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            h-3
                            flex-1
                            overflow-hidden
                            rounded-full
                            bg-slate-100
                          "
                        >

                          <div

                            className="
                              h-full
                              rounded-full
                              bg-[#3C83F6]
                              transition-all
                            "

                            style={{

                              width:

                                `${percentage}%`,

                            }}

                          />

                        </div>

                        <span
                          className="
                            w-12
                            text-right
                            text-sm
                            text-slate-500
                          "
                        >

                          {Math.round(
                            percentage
                          )}

                          %

                        </span>

                      </div>

                    </td>

                  </tr>

                );

              }

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}