"use client";

import QRCode from "react-qr-code";

type Props = {
  code: string;
};

export default function ArticleQRCode({
  code,
}: Props) {
  return (
    <div className="qr-print flex flex-col items-center gap-4 rounded-lg border p-6">

      <QRCode
        value={code}
        size={220}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
        />

      <span className="font-semibold">
        Código: {code}
      </span>

    </div>
  );
}