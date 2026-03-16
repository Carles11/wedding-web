const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

if (!VERCEL_TOKEN) throw new Error("Missing VERCEL_TOKEN in environment!");
if (!VERCEL_PROJECT_ID)
  throw new Error("Missing VERCEL_PROJECT_ID in environment!");

export type VercelDomainStatus = "valid" | "pending_validation" | "error";

export interface VercelDomainStatusResult {
  status: VercelDomainStatus;
  error?: string;
  dnsInstructions?: string;
}

export interface VercelProjectDomainResult {
  name: string;
  apexName?: string;
  projectId?: string;
  redirect?: string;
  redirectStatusCode?: number;
  verified?: boolean;
}

interface AddProjectDomainOptions {
  redirect?: string;
  redirectStatusCode?: number;
}

interface VercelVerificationInstruction {
  type: string;
  domain: string;
  value?: string;
  reason?: string;
  message?: string;
}

interface VercelDomainApiResponse {
  name: string;
  verified: boolean;
  redirect?: string;
  redirectStatusCode?: number;
  verification?: {
    status?: string;
    reason?: string;
    instructions?: VercelVerificationInstruction[];
  };
}

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

function extractVercelErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const maybeError = (data as { error?: { message?: string } }).error;
    if (maybeError?.message) {
      return maybeError.message;
    }

    const maybeMessage = (data as { message?: string }).message;
    if (maybeMessage) {
      return maybeMessage;
    }
  }

  return "Vercel API request failed";
}

function isAlreadyExistsError(status: number, message: string): boolean {
  if (status === 409) {
    return true;
  }

  return (
    status === 400 &&
    /already exists|already assigned|already added|already configured/i.test(
      message,
    )
  );
}

export async function getVercelProjectDomain(
  domain: string,
): Promise<VercelProjectDomainResult | null> {
  const normalizedDomain = normalizeDomain(domain);
  const url = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${normalizedDomain}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractVercelErrorMessage(data));
  }

  return data as VercelProjectDomainResult;
}

export async function getVercelDomainStatus(
  domain: string,
): Promise<VercelDomainStatusResult> {
  try {
    const normalizedDomain = normalizeDomain(domain);
    const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${normalizedDomain}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 404) {
      return { status: "error", error: "Domain not found on Vercel project." };
    }

    const data: VercelDomainApiResponse = await res.json();

    if (
      data.verification &&
      Array.isArray(data.verification.instructions) &&
      data.verification.instructions.length > 0
    ) {
      const instructions = data.verification.instructions
        .map((step) =>
          typeof step.message === "string"
            ? step.message
            : JSON.stringify(step),
        )
        .join("\n");
      const status: VercelDomainStatus =
        data.verification.status === "failed" ? "error" : "pending_validation";
      return {
        status,
        error: data.verification.reason,
        dnsInstructions: instructions,
      };
    }

    if (
      data.verified === true &&
      (!data.verification ||
        data.verification.status === "verified" ||
        data.verification.status === undefined)
    ) {
      return { status: "valid" };
    }

    return {
      status: "pending_validation",
      dnsInstructions:
        "Please configure your DNS according to Vercel's domain instructions.",
    };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Vercel API error";
    return { status: "error", error: errorMessage };
  }
}

export async function addDomainToVercelProject(
  domain: string,
  options: AddProjectDomainOptions = {},
): Promise<{ status: string; error?: string }> {
  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
  try {
    const normalizedDomain = normalizeDomain(domain);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: normalizedDomain,
        ...(options.redirect
          ? {
              redirect: normalizeDomain(options.redirect),
              redirectStatusCode: options.redirectStatusCode ?? 308,
            }
          : {}),
      }),
    });

    const data = await res.json().catch(() => null);
    const errorMessage = extractVercelErrorMessage(data);

    if (isAlreadyExistsError(res.status, errorMessage)) {
      return { status: "already_exists" };
    }
    if (res.status >= 400) {
      return {
        status: "error",
        error: errorMessage || "Failed to add domain",
      };
    }

    return { status: "added" };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error adding domain";
    return {
      status: "error",
      error: errorMessage,
    };
  }
}

export async function removeDomainFromVercelProject(
  domain: string,
): Promise<{ status: "deleted" | "not_found" | "error"; error?: string }> {
  const normalizedDomain = normalizeDomain(domain);
  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${normalizedDomain}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return { status: "not_found" };
    }
    if (res.status >= 400) {
      const data = await res.json().catch(() => null);
      return {
        status: "error",
        error: extractVercelErrorMessage(data) || "Failed to delete domain",
      };
    }

    return { status: "deleted" };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error deleting domain";
    return {
      status: "error",
      error: errorMessage,
    };
  }
}
