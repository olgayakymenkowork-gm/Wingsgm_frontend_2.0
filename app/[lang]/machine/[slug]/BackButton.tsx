"use client";

import { useRouter } from "next/navigation";

type Props = {
  fallback: string;
  label: string;
};

export default function BackButton({ fallback, label }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="backLink"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}
