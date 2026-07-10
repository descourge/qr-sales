"use client";

import {
  ShoppingCart,
  DollarSign,
  Receipt,
} from "lucide-react";

import {
  ReportSummary as ReportSummaryType,
} from "@/features/reports/types/report";

interface Props {

  summary: ReportSummaryType;

}

export default function ReportSummary({

  summary,

}: Props) {

  return (

    <div
      className="
        grid
        gap-5
        md:grid-cols-3
      "
    >

      {/* Total ventas */}

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-5
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <ShoppingCart
            className="
              text-[#3C83F6]
            "
          />

          <div>

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Total ventas

            </p>

            <p
              className="
                text-3xl
                font-bold
              "
            >

              {summary.totalSales}

            </p>

          </div>

        </div>

      </div>

      {/* Total vendido */}

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-5
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <DollarSign
            className="
              text-green-600
            "
          />

          <div>

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Total vendido

            </p>

            <p
              className="
                text-3xl
                font-bold
              "
            >

              $

              {Math.round(
                summary.totalAmount
              ).toLocaleString(
                "es-CL"
              )}

            </p>

          </div>

        </div>

      </div>

      {/* Ticket promedio */}

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-5
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Receipt
            className="
              text-[#F6BF1C]
            "
          />

          <div>

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Ticket promedio

            </p>

            <p
              className="
                text-3xl
                font-bold
              "
            >

              $

              {Math.round(
                summary.averageTicket
              ).toLocaleString(
                "es-CL"
              )}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}