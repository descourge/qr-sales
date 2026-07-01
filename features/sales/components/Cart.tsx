"use client";

import { SaleItem } from "../types/sale-item";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

type Props = {
  items: SaleItem[];
  onFinish: () => void;
  onIncrease: (articleId: number) => void;
  onDecrease: (articleId: number) => void;
  onRemove: (articleId: number) => void;
  onClear: () => void;
};

export default function Cart({
  items,
  onFinish,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: Props) {
  const total = items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const totalProducts = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="space-y-6">

      {items.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">

          <p className="text-slate-500">
            No hay productos agregados.
          </p>

        </div>

      ) : (

        <>

          {/* Lista */}

          <div
            className="
              space-y-2
              max-h-[55vh]
              overflow-y-auto
              pr-2
            "
          >

            {items.map((item) => (

              <div
                key={item.articleId}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  border-l-4
                  border-l-[#3C83F6]
                  bg-white
                  px-4
                  py-3
                  shadow-sm
                  transition
                  hover:shadow-md
                "
              >

                {/* Primera fila */}

                <div className="flex items-center justify-between gap-3">

                  <h3
                    className="
                      flex-1
                      truncate
                      text-[15px]
                      font-semibold
                      text-[#333333]
                    "
                  >
                    {item.description}
                  </h3>

                  <div className="flex items-center gap-3">

                    <span
                      className="
                        whitespace-nowrap
                        text-lg
                        font-bold
                        text-[#3C83F6]
                      "
                    >
                      $
                      {item.subtotal.toLocaleString("es-CL")}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onRemove(item.articleId)
                      }
                      className="
                        rounded-lg
                        p-2
                        text-red-500
                        transition
                        hover:bg-red-50
                      "
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

                {/* Segunda fila */}

                <div className="mt-2 flex items-center justify-between">

                  <span
                    className="
                      font-mono
                      text-xs
                      text-slate-500
                    "
                  >
                    #{item.code}
                  </span>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        onDecrease(item.articleId)
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        transition
                        hover:bg-slate-100
                      "
                    >
                      <Minus size={15} />
                    </button>

                    <span
                      className="
                        w-6
                        text-center
                        font-semibold
                      "
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onIncrease(item.articleId)
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#3C83F6]
                        text-white
                        transition
                        hover:bg-[#2F6FD3]
                      "
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Resumen */}

          <div className="rounded-2xl bg-slate-50 p-6">

            <div className="
flex
flex-col
gap-4
sm:flex-row
sm:items-center
sm:justify-between
">

              <div>

                <p className="text-sm text-slate-500">
                  Productos
                </p>

                <p className="text-3xl font-bold">
                  {totalProducts}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-slate-500">
                  Total
                </p>

                <p className="text-3xl font-bold text-[#3C83F6]">
                  $
                  {total.toLocaleString("es-CL")}
                </p>

              </div>

            </div>

            <div className="mt-6 flex flex-col gap-3">

              <button
                type="button"
                onClick={onFinish}
                className="
                  rounded-xl
                  bg-[#3C83F6]
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#2F6FD3]
                  hover:shadow-md
                "
              >
                Finalizar venta
              </button>

              <button
                type="button"
                onClick={onClear}
                className="
                  rounded-xl
                  bg-[#F6BF1C]
                  py-3
                  font-medium
                  text-[#333333]
                  transition
                  hover:brightness-95
                "
              >
                Vaciar carrito
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}