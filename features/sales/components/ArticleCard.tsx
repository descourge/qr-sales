"use client";

type Props = {
  article: {
    code: string;
    description: string;
    category: string;
    unitPrice: string;
  };

  quantity: number;

  onQuantityChange: (quantity: number) => void;

  onAdd: () => void;
};

export default function ArticleCard({
  article,
  quantity,
  onQuantityChange,
  onAdd,
}: Props) {
  return (
    <div className="mt-6 rounded-xl border bg-white p-6 shadow">

      <h2 className="text-xl font-bold">

        {article.description}

      </h2>

      <p className="mt-2">

        Categoría: {article.category}

      </p>

      <p className="mt-2 text-lg font-semibold">

        Precio: $

        {Number(article.unitPrice).toLocaleString("es-CL")}

      </p>

      <div className="mt-4">

        <label>

          Cantidad

        </label>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            onQuantityChange(Number(e.target.value))
          }
          className="mt-1 w-24 rounded border p-2"
        />

      </div>

      <button
        className="mt-6 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        onClick={onAdd}
      >
        Agregar al carrito
      </button>

    </div>
  );
}