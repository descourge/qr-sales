"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Package } from "lucide-react";

import { Article } from "@/shared/types/article";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  article: Article | null;
  quantity: string;
  onQuantityChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
};

export default function DetectedArticleModal({
  open,
  article,
  quantity,
  onQuantityChange,
  onAdd,
  onCancel,
}: Props) {
    const quantityRef =
  useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (open) {
    quantityRef.current?.focus();
    quantityRef.current?.select();
  }
}, [open]);

  if (!article) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onCancel();
        }
      }}
    >
      <DialogContent
  className="
    sm:max-w-lg
    rounded-2xl
    border
    border-gray-200
    bg-white
    shadow-2xl
  "
>

        <DialogHeader>

          <DialogTitle className="flex items-center gap-3">

            <Package
              className="text-[#3C83F6]"
              size={24}
            />

            Producto detectado

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Código
            </p>

            <p className="font-mono text-lg">
              {article.code}
            </p>

            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Descripción
            </p>

            <p className="text-lg font-semibold">
              {article.description}
            </p>

            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Precio
            </p>

            <p className="text-2xl font-bold text-[#3C83F6]">
              $
              {Number(article.unitPrice).toLocaleString(
                "es-CL"
              )}
            </p>

          </div>

<div className="flex flex-col items-center">

  <label className="mb-3 text-center font-medium text-[#333333]">
    Cantidad
  </label>

  <div className="flex items-center justify-center gap-3">

    <button
      type="button"
      onClick={() =>
        onQuantityChange(
          Math.max(1, Number(quantity) - 1).toString()
        )
      }
      className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        border-gray-300
        bg-white
        text-xl
        transition
        hover:bg-slate-100
      "
    >
      −
    </button>

    <input
      ref={quantityRef}
      type="number"
      min={1}
      step={1}
      inputMode="numeric"
      pattern="[0-9]*"
      value={quantity}
      onChange={(e) =>
        onQuantityChange(e.target.value)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onAdd();
        }
      }}
      className="
        w-20
        rounded-xl
        border
        border-gray-300
        py-2
        text-center
        text-lg
        font-semibold
        outline-none
        focus:border-[#3C83F6]
        [appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
      "
    />

    <button
      type="button"
      onClick={() =>
        onQuantityChange(
          (Number(quantity) + 1).toString()
        )
      }
      className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        bg-[#3C83F6]
        text-xl
        text-white
        transition
        hover:bg-[#2F6FD3]
      "
    >
      +
    </button>

  </div>

</div>

          <div className="flex justify-center gap-3">

            <button
              type="button"
              onClick={onCancel}
              className="
                rounded-xl
                border
                px-5
                py-3
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onAdd}
              className="
                rounded-xl
                bg-[#3C83F6]
                px-6
                py-3
                font-semibold
                text-white
                hover:bg-[#2F6FD3]
              "
            >
              Agregar
            </button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}