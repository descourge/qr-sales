"use client";

type Props = {
  article: {
    code: string;
    description: string;
    category: string;
    unitPrice: string;
  };

  quantity: string;

    onQuantityChange: (quantity: string) => void;

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
  <label className="mb-2 block font-medium">
    Cantidad
  </label>

  <div className="flex items-center gap-2">

    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-xl font-bold hover:bg-slate-300"
      onClick={() => {
        const current = Number(quantity) || 1;

        if (current > 1) {
          onQuantityChange(String(current - 1));
        }
      }}
    >
      −
    </button>

    <input
      type="number"
      min={1}
      max={99}
      step={1}
      inputMode="numeric"
      value={quantity}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
            onQuantityChange("");
            return;
        }

        if (/^\d+$/.test(value)) {
            onQuantityChange(value);
        }
        }}
      className="w-20 rounded border p-2 text-center"
    />

    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-xl font-bold text-white hover:bg-blue-700"
      onClick={() => {
        const current = Number(quantity) || 0;

        if (current < 99) {
          onQuantityChange(String(current + 1));
        }
      }}
    >
      +
    </button>

  </div>
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