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

describe("POST /api/sites/[id]/bulk-add-guests", () => {
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

  function createExistingGuestsQuery(
    existingGuests: Array<{ id: string; email: string }>,
  ) {
    const result = { data: existingGuests, error: null };
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      then: (resolve: (value: typeof result) => void) =>
        Promise.resolve(resolve(result)),
    };
  }

  function createUpdateQuery() {
    return {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "p1" }, error: null }),
    };
  }

  function createInsertQuery() {
    return {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "p2" }, error: null }),
    };
  }

  function createSupabaseMock(options: {
    site: { id: string; plan_type: string } | null;
    existingGuests?: Array<{ id: string; email: string }>;
    partyHandlers?: unknown[];
  }) {
    const siteQuery = createSiteQuery(options.site);
    const partyHandlers = [
      createExistingGuestsQuery(options.existingGuests ?? []),
      ...(options.partyHandlers ?? []),
    ];

    return {
      from: jest.fn((table: string) => {
        if (table === "sites") return siteQuery;
        if (table === "rsvp_parties") {
          const nextHandler = partyHandlers.shift();
          if (!nextHandler) {
            throw new Error(`Unexpected rsvp_parties query for ${table}`);
          }
          return nextHandler;
        }
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
      json: async () => ({
        rows: [{ name: "Taylor", email: "t@example.com" }],
      }),
    } as unknown as Request;

    const res = await POST(req, { params: { id: "s1" } });
    const json = (await res.json()) as { success: boolean; error?: string };

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Premium/i);
  });

  it("rejects duplicate emails in the same import before writes", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    const supabase = createSupabaseMock({
      site: { id: "s1", plan_type: "premium" },
      existingGuests: [],
      partyHandlers: [],
    });
    createSupabaseSSRClient.mockResolvedValue(supabase);

    const req = {
      json: async () => ({
        rows: [
          { name: "Taylor", email: "dup@example.com" },
          { name: "Jordan", email: "dup@example.com" },
        ],
      }),
    } as unknown as Request;

    const res = await POST(req, { params: { id: "s1" } });
    const json = (await res.json()) as {
      success: boolean;
      error?: string;
      results?: Array<{ email: string }>;
    };

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Duplicate emails/i);
    expect(json.results).toHaveLength(2);
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it("updates existing guests and creates new ones with summary counts", async () => {
    requireSiteAccess.mockResolvedValue({ ok: true, user: { id: "u1" } });
    createSupabaseSSRClient.mockResolvedValue(
      createSupabaseMock({
        site: { id: "s1", plan_type: "premium" },
        existingGuests: [{ id: "p1", email: "existing@example.com" }],
        partyHandlers: [createUpdateQuery(), createInsertQuery()],
      }),
    );

    const req = {
      json: async () => ({
        rows: [
          {
            name: "Existing Guest",
            email: "existing@example.com",
            preferred_lang: "en",
            max_guests: 2,
          },
          {
            name: "New Guest",
            email: "new@example.com",
            preferred_lang: "fr",
            max_guests: 1,
          },
        ],
      }),
    } as unknown as Request;

    const res = await POST(req, { params: { id: "s1" } });
    const json = (await res.json()) as {
      success: boolean;
      summary?: {
        created: number;
        updated: number;
        failed: number;
        totalRows: number;
      };
    };

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.summary).toEqual(
      expect.objectContaining({
        totalRows: 2,
        created: 1,
        updated: 1,
        failed: 0,
      }),
    );
  });
});
