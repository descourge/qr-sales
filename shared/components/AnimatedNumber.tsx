"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  prefix?: string;
};

export default function AnimatedNumber({
  value,
  duration = 800,
  prefix = "",
}: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;

    let animationFrame: number;

    const increment = value / (duration / 16);

    function animate() {
      start += increment;

      if (start >= value) {
        setDisplayValue(value);
        return;
      }

      setDisplayValue(Math.floor(start));

      animationFrame =
        requestAnimationFrame(animate);
    }

    animate();

    return () =>
      cancelAnimationFrame(animationFrame);

  }, [value, duration]);

  return (
    <>
      {prefix}
      {displayValue.toLocaleString("es-CL")}
    </>
  );
}