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
  verification?: {
    status?: string;
    reason?: string;
    instructions?: VercelVerificationInstruction[];
  };
}

export async function getVercelDomainStatus(
  domain: string,
): Promise<VercelDomainStatusResult> {
  try {
    const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}`;
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
    // console.log(
    //   "_____Vercel raw domain API result:",
    //   JSON.stringify(data, null, 2),
    // );

    // Highest priority: any instructions means DNS is NOT ready!
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
      // Show as pending/error no matter what `verified` claims
      const status: VercelDomainStatus =
        data.verification.status === "failed" ? "error" : "pending_validation";
      return {
        status,
        error: data.verification.reason,
        dnsInstructions: instructions,
      };
    }

    // Only consider truly 'valid' if ALL of these:
    if (
      data.verified === true &&
      (!data.verification ||
        data.verification.status === "verified" ||
        data.verification.status === undefined)
    ) {
      return { status: "valid" };
    }

    // Fallback: treat as pending if we can't verify readiness
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
): Promise<{ status: string; error?: string }> {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain.toLowerCase().trim() }),
    });

    const data = await res.json();

    if (res.status === 409) {
      // Conflict: already exists
      return { status: "already_exists" };
    }
    if (res.status >= 400) {
      return {
        status: "error",
        error: data.error?.message || data.message || "Failed to add domain",
      };
    }

    // Success!
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
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains/${domain}`;
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
      const data = await res.json();
      return {
        status: "error",
        error: data.error?.message || data.message || "Failed to delete domain",
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
