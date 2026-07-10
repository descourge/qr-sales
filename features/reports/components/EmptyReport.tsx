"use client";

import {
  BarChart3,
} from "lucide-react";

export default function EmptyReport() {

  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        gap-4
        rounded-2xl
        border
        bg-white
        py-24
        shadow-sm
      "
    >

      <BarChart3

        size={54}

        className="
          text-slate-300
        "

      />

      <div
        className="text-center"
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >

          No existen datos

        </h2>

        <p
          className="
            mt-2
            text-slate-500
          "
        >

          No existen ventas para los filtros
          seleccionados.

        </p>

      </div>

    </div>

  );

}