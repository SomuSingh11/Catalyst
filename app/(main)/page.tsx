"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/gitwhiz/");
  }, [router]);

  return null; // Nothing to render, immediate redirect
}
