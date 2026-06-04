"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import ProductList from "@/app/(shop)/shop/category/[slug]/ProductListContent"

export default function CategoryPage() {
  const { slug } = useParams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList slug={slug as string} />
    </Suspense>
  );
}