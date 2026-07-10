"use client";

import {
  Package,
  TrendingUp,
} from "lucide-react";

import {
  ProductReport,
} from "../types/report";

interface Props {

  products: ProductReport[];

}

export default function ProductReportCards({

  products,

}: Props) {

  const maxQuantity =

    products.length > 0

      ? Math.max(
          ...products.map(
            product => product.quantity
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

        <Package
          className="text-[#3C83F6]"
        />

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >

            Productos más vendidos

          </h2>

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Top 10 productos con mayor rotación.

          </p>

        </div>

      </div>

      <div
        className="
          grid
          gap-5
          p-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {products.map(

          (
            product,
            index
          ) => {

            const percentage =

              maxQuantity === 0

                ? 0

                : (

                    product.quantity /

                    maxQuantity

                  ) * 100;

            return (

              <div

                key={product.id}

                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-md
                "

              >

                <div
                  className="
                    mb-4
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div>

                    <div
                      className="
                        mb-2
                        text-2xl
                      "
                    >

                      {index === 0 && "🥇"}

                      {index === 1 && "🥈"}

                      {index === 2 && "🥉"}

                      {index > 2 &&
                        "📦"}

                    </div>

                    <h3
                      className="
                        font-semibold
                        text-slate-800
                      "
                    >

                      {product.name}

                    </h3>

                  </div>

                  <TrendingUp
                    size={20}
                    className="
                      text-[#3C83F6]
                    "
                  />

                </div>

                <div
                  className="
                    mb-4
                    h-3
                    overflow-hidden
                    rounded-full
                    bg-slate-200
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

                <div
                  className="
                    space-y-2
                    text-sm
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-slate-500
                      "
                    >

                      Unidades

                    </span>

                    <span
                      className="
                        font-semibold
                      "
                    >

                      {product.quantity}

                    </span>

                  </div>

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-slate-500
                      "
                    >

                      Total vendido

                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#3C83F6]
                      "
                    >

                      $

                      {Math.round(
                        product.total
                      ).toLocaleString(
                        "es-CL"
                      )}

                    </span>

                  </div>

                </div>

              </div>

            );

          }

        )}

      </div>

    </div>

  );

}