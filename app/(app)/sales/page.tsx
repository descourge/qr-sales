"use client";

import { useState } from "react";

import QRScanner from "@/features/sales/components/QRScanner";
import DetectedArticleModal from "@/features/sales/components/DetectedArticleModal";
import Cart from "@/features/sales/components/Cart";

import { getArticleByCode } from "@/features/sales/services/article.service";
import { SaleItem } from "@/features/sales/types/sale-item";
import { Article } from "@/shared/types/article";

import { saveSale } from "@/features/sales/services/sale.service";

import SaleCompletedModal from "@/features/sales/components/SaleCompletedModal";
import { toast } from "sonner";

import ConfirmDialog from "@/shared/components/ConfirmDialog";

import { notify } from "@/shared/lib/notify";

import { savePendingSale } from "@/shared/lib/offline-db";

import {
  notifyPendingSalesChanged,
} from "@/shared/lib/sync-events";

import {
  QrCode,
  ShoppingCart,
  Package,
} from "lucide-react";

import { useSession } from "@/features/auth/context/SessionProvider";


export default function SalesPage() {
  const [article, setArticle] = useState<Article | null>(null);

  // Se mantiene como string para permitir borrar el contenido del input
  const [quantity, setQuantity] = useState("1");

  const [cart, setCart] = useState<SaleItem[]>([]);

  const [scannerKey, setScannerKey] = useState(0);

  const {
  session,
} = useSession();

  const [saleCompletedOpen, setSaleCompletedOpen] =
    useState(false);

  const [completedSale, setCompletedSale] =
    useState<{
      id: number;
      createdAt: string;
      total: number;
      hasLocation: boolean;
      items: SaleItem[];
    } | null>(null);

    const [confirmOpen, setConfirmOpen] =
  useState(false);

const [confirmData, setConfirmData] =
  useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const total = cart.reduce(
  (sum, item) => sum + item.subtotal,
  0
);

const totalItems = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);
  

  async function handleDetected(code: string) {
    // Si ya hay un artículo pendiente, ignoramos nuevas lecturas
    if (article) return;

    if (!session) {

  return;

}

const result =
  await getArticleByCode(

    session.company.id,

    code

  );

    if (!result) {
      setScannerKey((k) => k + 1);
      return;
    }

    // Reiniciar la cantidad para el nuevo artículo
    setQuantity("1");
    setArticle(result);
  }

  function handleAdd() {
    if (!article) return;

    const quantityNumber = Number(quantity);

    if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
      notify.warning("Ingrese una cantidad válida.");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.code === article.code
      );

      if (existing) {
        return current.map((item) => {
          if (item.code !== article.code) return item;

          const newQuantity = item.quantity + quantityNumber;

          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.unitPrice,
          };
        });
      }

      return [
        ...current,
        {
        articleId: article.id,
        code: article.code,
        description: article.description,
        unitPrice: Number(article.unitPrice),
        quantity: quantityNumber,
        subtotal: Number(article.unitPrice) * quantityNumber,
        },
      ];
    });

    setArticle(null);
setQuantity("1");

setTimeout(() => {
  setScannerKey((k) => k + 1);
}, 150);
  }

  function handleIncrease(articleId: number) {
  setCart((current) =>
    current.map((item) => {
      if (item.articleId !== articleId) return item;

      const quantity = item.quantity + 1;

      return {
        ...item,
        quantity,
        subtotal: quantity * item.unitPrice,
      };
    })
  );
}

function handleDecrease(articleId: number) {
  setCart((current) =>
    current
      .map((item) => {
        if (item.articleId !== articleId) return item;

        const quantity = item.quantity - 1;

        return {
          ...item,
          quantity,
          subtotal: quantity * item.unitPrice,
        };
      })
      .filter((item) => item.quantity > 0)
  );
}

function handleRemove(articleId: number) {
  setConfirmData({
    title: "Eliminar producto",
    description:
      "¿Desea eliminar este producto del carrito?",
    onConfirm: () => {
      setCart((current) =>
        current.filter(
          (item) => item.articleId !== articleId
        )
      );

      setConfirmOpen(false);
      setConfirmData(null);
    },
  });

  setConfirmOpen(true);
}

function handleCloseSaleModal() {
  setSaleCompletedOpen(false);

  setCompletedSale(null);

  setCart([]);
}

async function getCurrentLocation() {
  return new Promise<{
    latitude: number | null;
    longitude: number | null;
  }>((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({
          latitude: null,
          longitude: null,
        });
      }
    );
  });
}

function handleFinishSale() {

  if (!session) {

  notify.error(
    "No existe una sesión activa."
  );

  return;

}

  if (cart.length === 0) return;

  setConfirmData({
    title: "Registrar venta",
    description: `¿Desea registrar la venta por $${total.toLocaleString("es-CL")}?`,
    onConfirm: confirmFinishSale,
  });

  setConfirmOpen(true);
}

async function confirmFinishSale() {
  if (cart.length === 0) {
    notify.warning("El carrito está vacío.");
    return;
  }

  try {
    const location = await getCurrentLocation();

    if (!session) {

  notify.error(
    "No existe una sesión activa."
  );

  return;

}

const saleData = {

  companyId:
    session.company.id,

  branchId:
    session.branch?.id ?? null,

  userId:
    session.user.id,

  createdAt:
    new Date().toISOString(),

  total,

  latitude:
    location.latitude,

  longitude:
    location.longitude,

  items: cart.map(
    item => ({
      articleId:
        item.articleId,
      quantity:
        item.quantity,
    })
  ),

};

if (!navigator.onLine) {
  await savePendingSale(saleData);
  notifyPendingSalesChanged();

  notify.info(
    "Venta guardada localmente. Se sincronizará cuando vuelva la conexión."
  );

  setCompletedSale({
    id: 0,
    createdAt: new Date().toLocaleString("es-CL"),
    total,
    hasLocation:
      location.latitude !== null &&
      location.longitude !== null,
    items: [...cart],
  });

  setSaleCompletedOpen(true);

  setConfirmOpen(false);
  setConfirmData(null);

  return;
}

const result = await saveSale(saleData);

setCompletedSale({
  id: result.id,
  createdAt: new Date(result.createdAt).toLocaleString("es-CL"),
  total: result.total,
  hasLocation:
    location.latitude !== null &&
    location.longitude !== null,
  items: [...cart],
});

setSaleCompletedOpen(true);

setConfirmOpen(false);
setConfirmData(null);

  } catch (error) {
    console.error(error);

    notify.error("No fue posible registrar la venta.");
  }
}

function handleClear() {
  if (cart.length === 0) return;

  setConfirmData({
    title: "Vaciar carrito",
    description:
      "Todos los productos serán eliminados del carrito.",
    onConfirm: () => {
      setCart([]);

      setConfirmOpen(false);
      setConfirmData(null);
    },
  });

  setConfirmOpen(true);
}

return (
  <div className="space-y-8">

    {/* Encabezado */}

    <div className="space-y-1">

      <h1 className="text-4xl font-bold text-[#333333]">
        Nueva Venta
      </h1>

      <p className="text-slate-500">
        Escanee productos y registre una venta.
      </p>

    </div>

    <div className="grid gap-6 grid-cols-1
xl:grid-cols-[1fr_420px]">

      {/* ===========================
          Columna Izquierda
      =========================== */}

      <div className="space-y-6">

        {/* Scanner */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <QrCode
              size={24}
              className="text-[#3C83F6]"
            />

            <h2 className="text-xl font-bold text-[#333333]">
              Escáner QR
            </h2>

          </div>

          <QRScanner
            onDetected={handleDetected}
            resetKey={scannerKey}
          />

        </section>

        {/* Producto */}

        

      </div>

      {/* ===========================
          Carrito
      =========================== */}

      <aside className="space-y-5">

        {/* Carrito */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <Cart
            items={cart}
            onFinish={handleFinishSale}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
            onClear={handleClear}
          />

        </div>

      </aside>

    </div>

    {/* Modales */}

    {completedSale && (
      <SaleCompletedModal
        open={saleCompletedOpen}
        saleId={completedSale.id}
        createdAt={completedSale.createdAt}
        total={completedSale.total}
        hasLocation={completedSale.hasLocation}
        items={completedSale.items}
        onClose={handleCloseSaleModal}
        buttonText="Nueva venta"
      />
    )}

    {confirmData && (
      <ConfirmDialog
        open={confirmOpen}
        title={confirmData.title}
        description={confirmData.description}
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={confirmData.onConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmData(null);
        }}
      />
    )}

    <DetectedArticleModal
          open={!!article}
          article={article}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAdd={handleAdd}
          onCancel={() => {
            setArticle(null);
            setQuantity("1");
            setScannerKey((k) => k + 1);
          }}
        />

  </div>
);
}