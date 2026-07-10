"use client";

import Image from "next/image";

type Props = {
  company: string;
  size?: number;
};

export default function CompanyLogo({
  company,
  size = 64,
}: Props) {
  const src =
    `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(company)}`;

  return (
    <Image
      src={src}
      alt={company}
      width={size}
      height={size}
      unoptimized
      priority={false}
    />
  );
}