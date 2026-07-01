"use client";

import { SaleItem } from "../types/sale-item";

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

  return (
    <div className="mt-8 rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Carrito
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500">
          No hay productos agregados.
        </p>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left">Código</th>
                <th className="pb-2 text-left">Producto</th>
                <th className="pb-2 text-center">Cantidad</th>
                <th className="pb-2 text-center">Precio</th>
                <th className="pb-2 text-center">Subtotal</th>
                <th className="pb-2 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                
                <tr key={item.articleId} className="border-b">
                  <td className="py-3 font-mono">
                    {item.code}
                  </td>

                  <td className="py-3">
                    {item.description}
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 hover:bg-slate-300"
                        onClick={() => onDecrease(item.articleId)}
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => onIncrease(item.articleId)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="text-center">
                    $
                    {item.unitPrice.toLocaleString("es-CL")}
                  </td>

                  <td className="text-center">
                    $
                    {item.subtotal.toLocaleString("es-CL")}
                  </td>

                  <td className="text-center">
                    <button
                      type="button"
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      onClick={() => onRemove(item.articleId)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex items-center justify-between border-t pt-6">

            <button
              type="button"
              className="rounded bg-red-600 px-5 py-3 text-white hover:bg-red-700"
              onClick={onClear}
            >
              Vaciar carrito
            </button>

            <div className="flex items-center gap-6">

              <span className="text-2xl font-bold">
                Total: $
                {total.toLocaleString("es-CL")}
              </span>

              <button
                type="button"
                className="rounded bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
                onClick={onFinish}
              >
                Finalizar venta
              </button>

            </div>

          </div>
        </>
      )}
    </div>
  );
}