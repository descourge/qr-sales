"use client";

import {
  Trophy,
  UserRound,
} from "lucide-react";

import {
  SellerReport,
} from "../types/report";

interface Props {

  sellers: SellerReport[];

}

export default function SellerReportTable({

  sellers,

}: Props) {

  const maxTotal =

    sellers.length > 0

      ? Math.max(
          ...sellers.map(
            seller => seller.total
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

        <UserRound
          className="text-[#3C83F6]"
        />

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >

            Ranking de vendedores

          </h2>

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Comparación del desempeño por vendedor.

          </p>

        </div>

      </div>

      <div
        className="
          overflow-x-auto
        "
      >

        <table className="w-full">

          <thead
            className="bg-slate-50"
          >

            <tr>

              <th className="px-6 py-4 text-center text-sm font-semibold">

                #

              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">

                Vendedor

              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">

                Sucursal

              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">

                Ventas

              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">

                Total

              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">

                Ticket Prom.

              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">

                Rendimiento

              </th>

            </tr>

          </thead>

          <tbody>

            {sellers.map(

              (
                seller,
                index
              ) => {

                const percentage =

                  maxTotal === 0

                    ? 0

                    : (

                        seller.total /

                        maxTotal

                      ) * 100;

                const average =

                  seller.sales === 0

                    ? 0

                    : seller.total /

                      seller.sales;

                return (

                  <tr

                    key={seller.id}

                    className="
                      border-t
                      transition-colors
                      hover:bg-slate-50
                    "

                  >

                    <td className="px-6 py-4 text-center">

                      {index === 0 && "🥇"}

                      {index === 1 && "🥈"}

                      {index === 2 && "🥉"}

                      {index > 2 &&
                        index + 1}

                    </td>

                    <td className="px-6 py-4">

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

                            className="text-yellow-500"

                          />

                        )}

                        <span
                          className="font-medium"
                        >

                          {seller.name}

                        </span>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-slate-600
                        "
                      >

                        {seller.branch}

                      </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                      {seller.sales}

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
                        seller.total
                      ).toLocaleString(
                        "es-CL"
                      )}

                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                      "
                    >

                      $

                      {Math.round(
                        average
                      ).toLocaleString(
                        "es-CL"
                      )}

                    </td>

                    <td className="px-6 py-4">

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
                              bg-green-500
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