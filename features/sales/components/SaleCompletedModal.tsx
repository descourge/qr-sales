"use client";

import { SaleItem } from "../types/sale-item";

import {
  CheckCircle2,
  MapPin,
  MapPinOff,
  ExternalLink,
} from "lucide-react";

type Props = {
  open: boolean;
  saleId: number;
  createdAt: string;
  total: number;
  hasLocation: boolean;
  latitude?: string | number | null;
  longitude?: string | number |null;
  items: SaleItem[];
  onClose: () => void;
  buttonText?: string;
};

export default function SaleCompletedModal({
  open,
  saleId,
  createdAt,
  total,
  hasLocation,
  latitude,
  longitude,
  items,
  onClose,
  buttonText = "Cerrar",
}: Props) {

  if (!open) {

    return null;

  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
    >

      <div
        className="
          flex
          w-full
          max-w-3xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* Encabezado */}

        <div
          className="
            shrink-0
            bg-green-600
            px-6
            py-6
            text-white
            sm:px-8
            sm:py-7
          "
        >

          <div className="flex items-center gap-3">

            <CheckCircle2 size={34} />

            <div>

              <h2 className="text-2xl font-bold sm:text-3xl">

                Venta registrada

              </h2>

              {saleId > 0 ? (

                <p className="mt-1 opacity-90">

                  Venta N° {saleId}

                </p>

              ) : (

                <p className="mt-1 font-medium text-yellow-200">

                  Pendiente de sincronización

                </p>

              )}

              <p className="text-sm opacity-80">

                {createdAt}

              </p>

            </div>

          </div>

        </div>

        {/* Contenido */}

        <div
          className="
            flex
            flex-1
            flex-col
            overflow-hidden
            p-6
            sm:p-8
          "
        >

          {/* ===================================
              LISTADO (ÚNICA ZONA CON SCROLL)
          =================================== */}

          <div
            className="
              flex-1
              overflow-y-auto
              pr-1
              md:pr-2
            "
          >

            {/* Escritorio */}

            <div className="hidden md:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="pb-3 text-left">

                      Código

                    </th>

                    <th className="pb-3 text-left">

                      Producto

                    </th>

                    <th className="pb-3 text-center">

                      Cant.

                    </th>

                    <th className="pb-3 text-right">

                      Precio

                    </th>

                    <th className="pb-3 text-right">

                      Subtotal

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {items.map((item) => (

                    <tr
                      key={item.articleId}
                      className="border-b last:border-0"
                    >

                      <td className="py-3 font-mono">

                        {item.code}

                      </td>

                      <td className="font-medium">

                        {item.description}

                      </td>

                      <td className="text-center">

                        {item.quantity}

                      </td>

                      <td className="text-right">

                        $
                        {item.unitPrice.toLocaleString("es-CL")}

                      </td>

                      <td className="text-right font-semibold text-[#3C83F6]">

                        $
                        {item.subtotal.toLocaleString("es-CL")}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Móvil */}

            <div className="space-y-3 md:hidden">

              {items.map((item) => (

                <div
                  key={item.articleId}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    p-4
                  "
                >

                  <p className="font-mono font-semibold">

                    {item.code}

                  </p>

                  <p className="mt-1 font-medium text-[#333333]">

                    {item.description}

                  </p>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-y-2
                      text-sm
                    "
                  >

                    <span className="text-slate-500">

                      Cantidad

                    </span>

                    <span className="text-right">

                      {item.quantity}

                    </span>

                    <span className="text-slate-500">

                      Precio

                    </span>

                    <span className="text-right">

                      $
                      {item.unitPrice.toLocaleString("es-CL")}

                    </span>

                    <span className="font-medium">

                      Subtotal

                    </span>

                    <span
                      className="
                        text-right
                        font-semibold
                        text-[#3C83F6]
                      "
                    >

                      $
                      {item.subtotal.toLocaleString("es-CL")}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Total */}

          <div
            className="
              mt-6
              shrink-0
              border-t
              pt-6
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <span className="text-xl font-semibold">

                Total

              </span>

              <span className="text-3xl font-bold text-[#3C83F6]">

                $
                {total.toLocaleString("es-CL")}

              </span>

            </div>

          </div>

          {/* GPS */}

          <div
            className="
              mt-6
              shrink-0
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-start gap-3">

                {hasLocation ? (

                  <MapPin
                    size={22}
                    className="mt-0.5 text-green-600"
                  />

                ) : (

                  <MapPinOff
                    size={22}
                    className="mt-0.5 text-slate-400"
                  />

                )}

                <div>

                  <h3 className="font-semibold">

                    Ubicación GPS

                  </h3>

                  <p className="mt-1 text-sm text-slate-500">

                    {hasLocation
                      ? "La ubicación de esta venta fue registrada correctamente."
                      : "No fue posible obtener la ubicación para esta venta."}

                  </p>

                </div>

              </div>

              {hasLocation &&
                latitude != null &&
                longitude != null && (

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${latitude},${longitude}`,
                        "_blank"
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#3C83F6]
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-[#2F6FD3]
                    "
                  >

                    <ExternalLink size={16} />

                    Ver mapa

                  </button>

                )}

            </div>

          </div>

        </div>

        {/* Pie */}

        <div
          className="
            shrink-0
            border-t
            bg-slate-50
            px-6
            py-5
            sm:px-8
          "
        >

          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-xl
              bg-green-600
              px-8
              py-3
              font-semibold
              text-white
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-green-700
              sm:w-auto
            "
          >

            {buttonText}

          </button>

        </div>

      </div>

    </div>

  );

}