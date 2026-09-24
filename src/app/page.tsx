import React from "react";
import { getProducts } from "@/lib/db";
import HomeClient from "./HomeClient";

// Revalidate or dynamic for fresh DB reads
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialProducts = await getProducts();

  return <HomeClient initialProducts={initialProducts} />;
}
