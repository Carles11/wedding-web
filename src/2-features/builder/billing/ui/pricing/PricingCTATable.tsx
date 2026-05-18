"use client";
import type { PlanType } from "@/4-shared/types";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Added useState
import PricingTable from "./PricingTable";

export default function PricingCTATable({
  t,
  lang,
  priceOverrides,
}: {
  t: Record<string, string>;
  lang: string;
  priceOverrides?: { price: number; currency: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  function handleSelect(plan: PlanType) {
    if (isLoading) return;
    setIsLoading(true);

    // Route to /[lang]/builder/checkout?plan=xyz
    router.push(`/${lang}/builder/checkout?plan=${plan}`);
  }
  return (
    <>
      <div className="mb-12">
        <Heading
          id="hero-title"
          as="h2"
          className="font-light text-left tracking-wide drop-shadow-lg max-w-[90%] md:max-w-3xl pb-8"
        >
          {t["pricing.for_couples"] ?? "For you two"}
        </Heading>
        <PricingTable
          translations={t}
          type="private"
          lang={lang}
          onSelect={handleSelect}
          isLoading={isLoading}
          priceOverrides={priceOverrides}
        />
      </div>
    </>
  );
}
