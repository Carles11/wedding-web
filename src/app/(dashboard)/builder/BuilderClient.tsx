"use client";

import { useState } from "react";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { useSite } from "@/4-shared/hooks/useSite";
import GeneralSiteForm from "@/1-widgets/builder/ui/GeneralSiteForm";
import ImagesBuilderStep from "@/1-widgets/builder/ui/ImagesBuilderStep";
import ProgramEventsBuilderStep from "@/1-widgets/builder/ui/ProgramEventsBuilderStep";
import AccommodationBuilderStep from "@/1-widgets/builder/ui/AccommodationBuilderStep";
import ContactBuilderStep from "@/1-widgets/builder/ui/ContactBuilderStep";
import WhatToSeeBuilderStep from "@/1-widgets/builder/ui/WhatToSeeBuilderStep";
import LogoutButton from "@/2-features/auth/ui/LogoutButton";

const STEPS = [
  "General",
  "Images",
  "Program",
  "Accommodation",
  "What to See / Do",
  "Contact",
  "Domain & Billing",
];

export default function BuilderClient() {
  const { user } = useSupabaseAuth();
  const {
    site,
    loading: siteLoading,
    error: siteError,
    refresh,
  } = useSite(user ?? null);
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Wedding-Web — Builder</h1>
          <p className="text-sm text-gray-600">
            Manage your event website content
          </p>
        </div>
        <div className="flex items-center gap-4">
          {site ? (
            <a
              className="text-sm text-blue-600"
              href={`https://${site.subdomain}.weddweb.com`}
              target="_blank"
              rel="noreferrer"
            >
              Open site preview
            </a>
          ) : (
            <span className="text-sm text-gray-500">No site yet</span>
          )}
          <LogoutButton />
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto bg-white shadow rounded flex">
          <nav className="w-64 border-r p-4">
            <h3 className="font-medium">Setup Steps</h3>
            <ul className="mt-4 space-y-2">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${i === active ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
                    onClick={() => setActive(i)}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <section className="flex-1 p-6">
            <h2 className="text-xl font-semibold">{STEPS[active]}</h2>

            <div className="mt-4">
              {siteLoading ? (
                <p>Loading your site record…</p>
              ) : siteError ? (
                <p className="text-red-600">Error loading site: {siteError}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Site ID: {site?.id ?? "(not created yet)"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Subdomain: {site?.subdomain ?? "-"}
                  </p>
                </>
              )}

              <div className="mt-8 border rounded p-4 bg-gray-50">
                {active === 0 && (
                  <div>
                    <GeneralSiteForm site={site ?? null} refresh={refresh} />
                  </div>
                )}

                {active === 1 && (
                  <div>
                    <ImagesBuilderStep site={site ?? null} refresh={refresh} />
                  </div>
                )}

                {active === 2 && (
                  <div>
                    <ProgramEventsBuilderStep
                      site={site ?? null}
                      refresh={refresh}
                    />
                  </div>
                )}

                {active === 3 && (
                  <div>
                    <AccommodationBuilderStep
                      site={site ?? null}
                      refresh={refresh}
                    />
                  </div>
                )}

                {active === 4 && (
                  <>
                    <WhatToSeeBuilderStep
                      site={site ?? null}
                      refresh={refresh}
                    />
                  </>
                )}
                {active === 5 && (
                  <div>
                    <ContactBuilderStep site={site ?? null} refresh={refresh} />
                  </div>
                )}

                {active === 6 && (
                  <div>
                    <p className="text-gray-700">
                      Domain & Billing (custom domains, DNS instructions,
                      upgrade CTA/paywall).
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded">
                  Save changes
                </button>
                <button className="px-4 py-2 border rounded bg-white">
                  Preview
                </button>
                <button
                  className="px-3 py-2 text-sm text-gray-600"
                  onClick={() =>
                    alert("Implement discard/restore functionality")
                  }
                >
                  Discard changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
