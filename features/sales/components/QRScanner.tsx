"use client";

import { useZxing } from "react-zxing";
import { useEffect, useRef } from "react";

type Props = {
  onDetected: (code: string) => void;
  resetKey: number;
};

export default function QRScanner({

    onDetected,
    resetKey,

}: Props) {
    const isLocked = useRef(false);

    const { ref } = useZxing({
        constraints: {
            video: {
            facingMode: "environment",
            },
        },

        onDecodeResult(result) {
            if (isLocked.current) return;

            const code = result.rawValue;

            if (!code) return;

            isLocked.current = true;

            onDetected(code);
            },
        });
        
    useEffect(() => {
    isLocked.current = false;
    }, [resetKey]);

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