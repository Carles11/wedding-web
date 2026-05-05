import { GET } from "./route";

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

describe("GET /api/sites/[id]/rsvp-analytics", () => {
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
    (global as unknown as { Response: typeof MockResponse }).Response =
      MockResponse;
  });

  afterAll(() => {
    (global as unknown as { Response: typeof originalResponse }).Response =
      originalResponse;
  });

  function createSiteQuery(site: { id: string; plan_type: string } | null) {
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: site, error: null }),
    };
  }

  function createThenableQuery<T>(rows: T[]) {
    const result = { data: rows, error: null };
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: (resolve: (value: typeof result) => void) =>
        Promise.resolve(resolve(result)),
    };
  }

  function createSupabaseMock(options: {
    site: { id: string; plan_type: string } | null;
    parties?: Array<{ preferred_lang: string | null; access_code_hash: string | null }>;
    states?: Array<{ status: string | null; meal_intolerances: string | null }>;
  }) {
    const siteQuery = createSiteQuery(options.site);
    const partiesQuery = createThenableQuery(options.parties ?? []);
    const stateQuery = createThenableQuery(options.states ?? []);

    return {
      from: jest.fn((table: string) => {
        if (table === "sites") return siteQuery;
        if (table === "rsvp_parties") return partiesQuery;
        if (table === "rsvp_party_state") return stateQuery;
        throw new Error(`Unexpected table: ${table}`);
      }),
    };
  }

  it("returns 403 for non-premium sites", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    const supabase = createSupabaseMock({
      site: { id: "s1", plan_type: "free" },
    });
    createSupabaseSSRClient.mockResolvedValue(supabase);

    const res = await GET({} as Request, { params: { id: "s1" } });
    const json = (await res.json()) as { success: boolean; error?: string };

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Premium/i);
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it("returns analytics payload for premium sites", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    createSupabaseSSRClient.mockResolvedValue(
      createSupabaseMock({
        site: { id: "s1", plan_type: "premium" },
        parties: [
          { preferred_lang: "en", access_code_hash: "hash-1" },
          { preferred_lang: "en", access_code_hash: null },
          { preferred_lang: "fr", access_code_hash: "hash-2" },
        ],
        states: [
          { status: "attending", meal_intolerances: "vegan" },
          { status: "not_attending", meal_intolerances: "" },
          { status: "unknown", meal_intolerances: "gluten" },
        ],
      }),
    );

    const res = await GET({} as Request, { params: { id: "s1" } });
    const json = (await res.json()) as {
      success: boolean;
      analytics?: {
        summary: {
          invitations_sent: number;
          rsvps_received: number;
          attending_count: number;
          attendance_rate: number;
        };
        languages: Array<{ key: string; count: number }>;
        dietary: Array<{ key: string; count: number }>;
      };
    };

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.analytics?.summary).toEqual(
      expect.objectContaining({
        invitations_sent: 2,
        rsvps_received: 2,
        attending_count: 1,
        attendance_rate: 50,
      }),
    );
    expect(json.analytics?.languages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "en", count: 2 }),
        expect.objectContaining({ key: "fr", count: 1 }),
      ]),
    );
    expect(json.analytics?.dietary).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: "vegan", count: 1 })]),
    );
  });

  it("returns zero-safe analytics for premium sites with empty data", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    createSupabaseSSRClient.mockResolvedValue(
      createSupabaseMock({
        site: { id: "s1", plan_type: "premium" },
        parties: [],
        states: [],
      }),
    );

    const res = await GET({} as Request, { params: { id: "s1" } });
    const json = (await res.json()) as {
      success: boolean;
      analytics?: {
        summary: {
          invitations_sent: number;
          rsvps_received: number;
          attending_count: number;
          attendance_rate: number;
        };
        languages: unknown[];
        dietary: unknown[];
      };
    };

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.analytics?.summary).toEqual({
      invitations_sent: 0,
      rsvps_received: 0,
      attending_count: 0,
      attendance_rate: 0,
    });
    expect(json.analytics?.languages).toHaveLength(0);
    expect(json.analytics?.dietary).toHaveLength(0);
  });
});
