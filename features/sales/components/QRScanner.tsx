"use client";

import { useZxing } from "react-zxing";
import { useState } from "react";

type Props = {

    onDetected: (
        code: string
    ) => void;

};

export default function QRScanner({

    onDetected,

}: Props) {

    const [lastCode, setLastCode] = useState("");

    const { ref } = useZxing({
        constraints: {
            video: {
            facingMode: "environment",
            },
        },

        onDecodeResult(result) {
            const code = result.rawValue;

            if (!code) return;

            if (code === lastCode) return;

            setLastCode(code);

            onDetected(code);
            },
        });

    return (
        <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-4 shadow">
            <video
            ref={ref}
            className="aspect-square w-full rounded-lg object-cover"
            />

            <p className="mt-3 text-center text-sm text-gray-500">
            Apunta la cámara hacia el código QR.
            </p>
        </div>
        );

}