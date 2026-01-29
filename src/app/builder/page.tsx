"use client";

import WhatToSeeBuilderStep from "@/components/builder/WhatToSeeBuilderStep";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { useSite } from "@/4-shared/hooks/useSite";
import GeneralSiteForm from "@/components/builder/GeneralSiteForm";
import ImagesBuilderStep from "@/components/builder/ImagesBuilderStep";
import ProgramEventsBuilderStep from "@/components/builder/ProgramEventsBuilderStep";
import AccommodationBuilderStep from "@/components/builder/AccommodationBuilderStep";
import ContactBuilderStep from "@/components/builder/ContactBuilderStep";
import { supabase } from "@/4-shared/api/supabaseClient";
// Set BYPASS_AUTH to true for local development and UI previews.
// Always set to false before production deployment.
const BYPASS_AUTH = true;

// Minimal mock user used only when BYPASS_AUTH is enabled. Cast to `User` shape
// so the rest of the hooks/components that expect a Supabase `User` can run.
const DEV_MOCK_USER = {
  // Use a valid UUID for dev/preview users so DB uuid columns accept it.
  id: "00000000-0000-0000-0000-000000000001",
  email: "dev@dev.local",
} as unknown as User | null;

const STEPS = [
  "General",
  "Images",
  "Program",
  "Accommodation",
  "What to See / Do",
  "Contact",
  "Domain & Billing",
];

export default function BuilderPage() {
  const { user, loading: authLoading, signOut } = useSupabaseAuth();

  // When BYPASS_AUTH is enabled, act as if a valid session exists using the
  // DEV_MOCK_USER. Otherwise use the real authenticated user from the hook.
  const effectiveUser = BYPASS_AUTH ? DEV_MOCK_USER : user;
  const effectiveSignOut = BYPASS_AUTH
    ? () => console.log("BYPASS_AUTH: signOut called")
    : signOut;

  const {
    site,
    loading: siteLoading,
    error: siteError,
    refresh,
  } = useSite(effectiveUser ?? null);
  const [active, setActive] = useState(0);

  // If not bypassing auth, show the auth-loading and sign-in CTA as before.
  if (!BYPASS_AUTH && authLoading)
    return <div className="p-6">Loading authentication…</div>;

  if (!BYPASS_AUTH && !effectiveUser)
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Builder</h2>
        <p className="mt-4">
          You must be signed in to access the site builder.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() =>
              supabase.auth.signInWithOtp({
                email: window.prompt("Email to sign in:") || "",
              })
            }
          >
            Sign in (email OTP)
          </button>
        </div>
      </div>
    );

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
          <button
            className="text-sm text-red-600"
            onClick={() => effectiveSignOut()}
          >
            Sign out
          </button>
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
                {/* TODO: Replace the following placeholders with real per-section forms/components. */}
                {active === 0 && (
                  <div>
                    {/* General info form component */}
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
                    <div>
                      {/* What to see/do section editor */}
                      <p className="text-gray-700">
                        TODO: What to see/DO editor (places, descriptions,
                        images).
                      </p>
                    </div>
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
                    {/* Billing / Domain input for custom domains + upgrade CTA */}
                    <p className="text-gray-700">
                      TODO: Domain & Billing (custom domains, DNS instructions,
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
                    alert("TODO: Implement discard/restore functionality")
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
