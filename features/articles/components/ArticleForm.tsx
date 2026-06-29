"use client";

import { useState } from "react";

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
      alert("Error al guardar.");
      return;
    }

    alert("Artículo creado.");

    onCreated();

    setForm({
      code: "",
      description: "",
      category: "",
      unitPrice: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        className="border p-2 w-full"
        placeholder="Código"
        name="code"
        value={form.code}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Descripción"
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Categoría"
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full"
        placeholder="Precio"
        name="unitPrice"
        type="number"
        value={form.unitPrice}
        onChange={handleChange}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </form>
  );
}