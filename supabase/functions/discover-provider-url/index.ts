// supabase/functions/discover-provider-url/index.ts

// 1. Types & Config
type DenoRuntime = {
  resolveDns: (
    query: string,
    recordType: "TXT" | "CNAME",
  ) => Promise<string[] | string[][]>;
};

declare const Deno: DenoRuntime & {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// 2. Helpers
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toApexDomain(domainInput: string): string {
  return domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "")
    .replace(/^www\./, "");
}

function normalizeProviderUrl(value: string): string | null {
  const candidate = value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "")
    .replace(/\/v2$/i, "");
  if (!candidate) return null;
  return /^[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s'"`]+)?$/i.test(candidate)
    ? candidate
    : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { domain } = await req.json();
    const apex = toApexDomain(domain);
    const host = `_domainconnect.${apex}`;
    let providerUrl: string | null = null;

    console.log(`🔎 Querying: ${host}`);

    // Try TXT first
    try {
      const txt = await Deno.resolveDns(host, "TXT");
      providerUrl = extractProviderUrl(txt);
    } catch {
      console.log("No TXT record.");
    }

    // Try CNAME fallback (Common for Ionos/GoDaddy users)
    if (!providerUrl) {
      try {
        const cname = await Deno.resolveDns(host, "CNAME");
        if (cname.length > 0) {
          // CNAME returns the URL/Host directly
          providerUrl = normalizeProviderUrl(
            Array.isArray(cname[0]) ? cname[0].join("") : cname[0],
          );
        }
      } catch {
        console.log("No CNAME record.");
      }
    }

    console.log(`🎯 Discovery for ${apex}: ${providerUrl}`);
    return jsonResponse({ providerUrl, domain: apex });
  } catch (error) {
    return jsonResponse({ providerUrl: null }, 200);
  }
});

function extractProviderUrl(records: string[] | string[][]): string | null {
  const rawValues = records
    .map((record) => (Array.isArray(record) ? record.join("") : record))
    .map((value) => value.trim())
    .filter(Boolean);

  for (const rawValue of rawValues) {
    // FIXED REGEX: Changed (??: to (?:
    const keyedMatch = rawValue.match(
      /(?:^|[;\s])(?:url|api|provider[_-]?url|domainconnect)\s*=\s*(?:['"])?([^;'"\s]+)(?:['"])?/i,
    );

    if (keyedMatch) {
      const normalized = normalizeProviderUrl(keyedMatch[1]);
      if (normalized) return normalized;
    }

    const directMatch = rawValue.match(
      /(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s'"`]+)?)/i,
    );

    if (directMatch) {
      const normalized = normalizeProviderUrl(directMatch[1]);
      if (normalized) return normalized;
    }
  }
  return null;
}

function isMissingTxtRecord(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /NXDOMAIN|ENODATA|NOTFOUND|not found|no such host|No record/i.test(
    message,
  );
}

// 3. Main Handler
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    let body: { domain?: string } | null = null;
    try {
      body = (await req.json()) as { domain?: string };
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const apexDomain = toApexDomain(
      typeof body?.domain === "string" ? body.domain : "",
    );

    if (!apexDomain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(apexDomain)) {
      return jsonResponse({ error: "A valid domain is required" }, 400);
    }

    try {
      const txtRecords = await Deno.resolveDns(
        `_domainconnect.${apexDomain}`,
        "TXT",
      );
      const providerUrl = extractProviderUrl(txtRecords);

      return jsonResponse({ providerUrl, domain: apexDomain });
    } catch (error) {
      if (isMissingTxtRecord(error)) {
        return jsonResponse({ providerUrl: null, domain: apexDomain });
      }
      throw error;
    }
  } catch (error) {
    console.error("discover-provider-url failed", error);
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to discover provider URL",
      },
      500,
    );
  }
});
