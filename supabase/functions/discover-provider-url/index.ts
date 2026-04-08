type DenoRuntime = {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  resolveTxt: (query: string) => Promise<string[][]>;
};

declare const Deno: DenoRuntime;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
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

function extractProviderUrl(records: string[][]): string | null {
  const rawValues = records
    .map((record) => record.join(""))
    .map((value) => value.trim())
    .filter(Boolean);

  for (const rawValue of rawValues) {
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
      const txtRecords = await Deno.resolveTxt(`_domainconnect.${apexDomain}`);
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
