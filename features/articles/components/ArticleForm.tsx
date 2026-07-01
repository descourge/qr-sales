"use client";

import { useState } from "react";

import {
  PackagePlus,
  Save,
} from "lucide-react";

import { notify } from "@/shared/lib/notify";

type Props = {
  onCreated: () => void;
};

export default function ArticleForm({
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    code: "",
    description: "",
    category: "",
    unitPrice: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        unitPrice: Number(form.unitPrice),
      }),
    });

    if (!response.ok) {
      notify.error("Error al guardar.");
      return;
    }

    notify.success("Artículo creado.");

    onCreated();

    setForm({
      code: "",
      description: "",
      category: "",
      unitPrice: "",
    });
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <PackagePlus
          size={24}
          className="text-[#3C83F6]"
        />

        <div>

          <h2 className="text-xl font-bold text-[#333333]">
            Nuevo artículo
          </h2>

          <p className="text-sm text-slate-500">
            Complete la información del producto.
          </p>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-[#333333]">
              Código
            </label>

            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Ej: 1001"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-[#3C83F6]
                focus:ring-2
                focus:ring-[#3C83F6]/20
              "
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-[#333333]">
              Categoría
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ej: Bebidas"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-[#3C83F6]
                focus:ring-2
                focus:ring-[#3C83F6]/20
              "
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-[#333333]">
            Descripción
          </label>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ej: Coca Cola 350cc"
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#3C83F6]
              focus:ring-2
              focus:ring-[#3C83F6]/20
            "
          />

        </div>

        <div className="max-w-xs">

          <label className="mb-2 block text-sm font-medium text-[#333333]">
            Precio unitario
          </label>

          <input
            name="unitPrice"
            type="number"
            min={0}
            value={form.unitPrice}
            onChange={handleChange}
            placeholder="1800"
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              outline-none
              transition
              focus:border-[#3C83F6]
              focus:ring-2
              focus:ring-[#3C83F6]/20
            "
          />

        </div>

        <div className="flex justify-end">

          <button
            type="submit"
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#3C83F6]
              px-6
              py-3
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#2F6FD3]
              hover:shadow-md
            "
          >
            <Save size={18} />

            Guardar artículo

          </button>

        </div>

      </form>

    </section>
  );
}