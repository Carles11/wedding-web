import { POST } from "./route";

jest.mock("@/4-shared/lib/requireSiteAccess", () => ({
  requireSiteAccess: jest.fn(),
}));

jest.mock("@/4-shared/lib/supabase/server", () => ({
  createSupabaseSSRClient: jest.fn(),
}));

const { requireSiteAccess } = jest.requireMock(
  "@/4-shared/lib/requireSiteAccess",
) as {
  requireSiteAccess: jest.Mock;
};

const { createSupabaseSSRClient } = jest.requireMock(
  "@/4-shared/lib/supabase/server",
) as {
  createSupabaseSSRClient: jest.Mock;
};

describe("POST /api/sites/[id]/bulk-invite", () => {
  const originalEnv = { ...process.env };
  const originalResponse = global.Response;

  class MockResponse {
    status: number;
    private readonly payload: unknown;

    constructor(payload: unknown, init?: { status?: number }) {
      this.payload = payload;
      this.status = init?.status ?? 200;
    }

    static json(payload: unknown, init?: { status?: number }) {
      return new MockResponse(payload, init);
    }

    async json() {
      return this.payload;
    }
  }

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.MY_CUSTOM_SERVICE_KEY = "service-key";
    global.fetch = jest.fn();
    (global as unknown as { Response: typeof MockResponse }).Response =
      MockResponse;
  });

  afterAll(() => {
    process.env = originalEnv;
    (global as unknown as { Response: typeof originalResponse }).Response =
      originalResponse;
  });

  function createSupabaseMock(options: {
    site: { id: string; plan_type: string } | null;
    guests?: Array<{ id: string; email: string | null }>;
  }) {
    const siteQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest
        .fn()
        .mockResolvedValue({ data: options.site, error: null }),
    };

    const guestsResult = { data: options.guests ?? [], error: null };
    const guestQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      then: (resolve: (value: typeof guestsResult) => void) =>
        Promise.resolve(resolve(guestsResult)),
    };

    return {
      from: jest.fn((table: string) => {
        if (table === "sites") return siteQuery;
        if (table === "rsvp_parties") return guestQuery;
        throw new Error(`Unexpected table: ${table}`);
      }),
    };
  }

  it("returns 403 for non-premium sites", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    createSupabaseSSRClient.mockResolvedValue(
      createSupabaseMock({ site: { id: "s1", plan_type: "free" } }),
    );

    const req = {
      json: async () => ({ mode: "all" }),
    } as unknown as Request;

    const res = await POST(req, { params: { id: "s1" } });
    const json = (await res.json()) as { success: boolean; error?: string };

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Premium/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends bulk invites for premium sites and returns summary", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    createSupabaseSSRClient.mockResolvedValue(
      createSupabaseMock({
        site: { id: "s1", plan_type: "premium" },
        guests: [
          { id: "p1", email: "a@example.com" },
          { id: "p2", email: null },
          { id: "p3", email: "b@example.com" },
        ],
      }),
    );

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, text: async () => "" })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "boom",
      });

    const req = {
      json: async () => ({ mode: "all" }),
    } as unknown as Request;

    const res = await POST(req, { params: { id: "s1" } });
    const json = (await res.json()) as {
      success: boolean;
      summary?: {
        sent: number;
        skippedNoEmail: number;
        failed: number;
        totalCandidates: number;
      };
    };

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.summary).toEqual(
      expect.objectContaining({
        totalCandidates: 3,
        sent: 1,
        skippedNoEmail: 1,
        failed: 1,
      }),
    );
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
