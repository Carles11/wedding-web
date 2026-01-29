"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/4-shared/api/supabaseClient";
import type { Site, HeroSection } from "@/4-shared/types";

type Props = {
  site: Site | null;
  refresh: () => void; // called after successful save to re-fetch site
};

const AVAILABLE_LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ca", label: "Català" },
  { code: "fr", label: "Français" },
];

const FREE_LANG_LIMIT = 1; // Free plan allows only 1 language

export default function GeneralSiteForm({ site, refresh }: Props) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

  useEffect(() => {
    if (!site) return;
    setTitle((site as Site).title ?? "");
    // default_lang may be present
    const langs =
      site.languages ?? (site.default_lang ? [site.default_lang] : []);
    setLanguages(langs ?? []);
    setSubdomain(site.subdomain ?? "");
    // Attempt to load existing hero section subtitle for the default_lang
    (async () => {
      try {
        const { data } = await supabase
          .from("sections")
          .select("id, content")
          .eq("site_id", site.id)
          .eq("type", "hero")
          .maybeSingle();
        if (data && data.content) {
          // content may be object; try to read subtitle for default_lang or fallback to plain subtitle
          const content = data.content as Record<string, unknown>;
          const def =
            site.default_lang ?? (site.languages && site.languages[0]);
          if (def && typeof content["subtitle"] === "object") {
            const subObj = content["subtitle"] as Record<string, string>;
            setSubtitle(subObj[def] ?? "");
          } else if (typeof content["subtitle"] === "string") {
            setSubtitle(content["subtitle"] as string);
          }
        }
      } catch (err: unknown) {
        // ignore fetch errors for initial subtitle load
      }
    })();
  }, [site]);

  function validateSubdomain(value: string) {
    const v = value.toLowerCase();
    if (v.length < 3 || v.length > 24) return "Subdomain must be 3-24 chars";
    if (!/^[a-z0-9-]+$/.test(v))
      return "Use only lowercase letters, numbers and hyphens";
    return null;
  }

  const toggleLang = (code: string) => {
    setError(null);
    setSuccess(null);
    if (languages.includes(code)) {
      setLanguages((s) => s.filter((l) => l !== code));
      setShowUpgradeCTA(false);
      return;
    }
    // enforce free tier limit
    if (languages.length >= FREE_LANG_LIMIT) {
      setShowUpgradeCTA(true);
      return;
    }
    setLanguages((s) => [...s, code]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || title.trim().length === 0) {
      setError("Please enter a site title.");
      return;
    }

    if (!site) {
      setError("Site not ready. Please try again later.");
      return;
    }

    // If subdomain is empty, user can set it; otherwise show-only
    if (!site.subdomain) {
      const subErr = validateSubdomain(subdomain);
      if (subErr) {
        setError(subErr);
        return;
      }
    }

    setSaving(true);
    try {
      const payload: Partial<Site> = {
        title: title.trim(),
        default_lang: languages[0] ?? site.default_lang ?? "en",
        languages:
          languages.length > 0
            ? languages
            : (site.languages ?? [site.default_lang ?? "en"]),
      };
      if (!site.subdomain) payload.subdomain = subdomain.toLowerCase();

      // Update the sites row
      const { data: updatedSite, error: updateErr } = await supabase
        .from("sites")
        .update(payload)
        .eq("id", site.id)
        .select(
          "id, owner_user_id, subdomain, default_lang, languages, domains, title",
        )
        .maybeSingle();

      if (updateErr) throw updateErr;

      // Upsert hero section: set content.subtitle for default language
      const heroContent: Record<string, unknown> = {};
      const defLang =
        payload.default_lang ?? site.default_lang ?? languages[0] ?? "en";
      // For multilingual support we'd store an object keyed by language. For free tier we store plain string.
      heroContent.subtitle = {
        [defLang]: subtitle,
      };

      // Find existing hero
      const { data: existingHero } = await supabase
        .from("sections")
        .select("id")
        .eq("site_id", site.id)
        .eq("type", "hero")
        .maybeSingle();

      const existingHeroRow = existingHero as unknown as { id?: string } | null;
      if (existingHeroRow && existingHeroRow.id) {
        await supabase
          .from("sections")
          .update({ content: heroContent })
          .eq("id", existingHeroRow.id);
      } else {
        await supabase.from("sections").insert([
          {
            site_id: site.id,
            type: "hero",
            title: title.trim(),
            content: heroContent,
          },
        ]);
      }

      setSuccess("Saved successfully");
      // Ask parent to refresh site data
      refresh();
    } catch (err: unknown) {
      console.error("GeneralSiteForm save error:", err);
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Main title
        </label>
        <input
          className="mt-1 block w-full rounded border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subtitle
        </label>
        <textarea
          rows={3}
          className="mt-1 block w-full rounded border px-3 py-2"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Languages
        </label>
        <p className="text-xs text-gray-500">
          Free plan: choose one language. Upgrade to add more.
        </p>
        <div className="mt-2 flex gap-3">
          {AVAILABLE_LANGS.map((l) => {
            const checked = languages.includes(l.code);
            const disabled = !checked && languages.length >= FREE_LANG_LIMIT;
            return (
              <label
                key={l.code}
                className={`inline-flex items-center gap-2 px-2 py-1 border rounded ${disabled ? "opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleLang(l.code)}
                />
                <span className="text-sm">{l.label}</span>
              </label>
            );
          })}
        </div>
        {showUpgradeCTA && (
          <div className="mt-2 text-sm text-yellow-800">
            Need more languages?{" "}
            <button className="underline text-blue-600">Upgrade to Pro</button>
            {/* TODO: hook into billing/plan status and route to upgrade flow */}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subdomain
        </label>
        {site?.subdomain ? (
          <div className="mt-1 text-sm text-gray-700">{site.subdomain}</div>
        ) : (
          <div className="mt-1 flex gap-2 items-center">
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="your-name-2026"
              className="rounded border px-3 py-2"
            />
            <span className="text-sm text-gray-500">.weddweb.com</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <a
          className={`text-sm ${site?.subdomain ? "text-blue-600" : "text-gray-400"}`}
          href={
            site?.subdomain
              ? `https://${site.subdomain}.weddweb.com`
              : undefined
          }
          target="_blank"
          rel="noreferrer"
        >
          Preview site
        </a>
        {success && <div className="text-sm text-green-600">{success}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </form>
  );
}
