"use client";
import type { PlanType } from "@/4-shared/types";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import { useRouter } from "next/navigation";
import PricingTable from "./PricingTable";

// Wraps PricingTable for both private & agency
export default function PricingCTATable({
  t,
  lang,
}: {
  t: Record<string, string>;
  lang: string;
}) {
  const router = useRouter();

  function handleSelect(plan: PlanType) {
    // Route to /checkout?plan=xyz&lang=...
    router.push(`/builder/checkout?plan=${plan}&lang=${lang}`);
  }

  return (
    <>
      <div className="mb-12">
        <Heading
          id="hero-title"
          as="h2"
          className="font-ligh text-left tracking-wide drop-shadow-lg max-w-[90%] md:max-w-3xl pb-8"
        >
          {t["pricing.for_couples"] ?? "For couples"}
        </Heading>
        <PricingTable
          translations={t}
          type="private"
          lang={lang}
          onSelect={handleSelect}
        />
      </div>
      {/* TODO(agencies): un-comment when launching agency tier
      <div className="mb-12">
        <Heading
          id="hero-title"
          as="h2"
          className="font-ligh text-left tracking-wide drop-shadow-lg max-w-[90%] md:max-w-3xl pb-8"
        >
          For agencies and businesses
        </Heading>
        <PricingTable translations={t} type="agency" onSelect={handleSelect} />
      </div>
      */}
    </>
  );
}
