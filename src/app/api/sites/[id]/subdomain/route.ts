import { updateSubdomain } from "@/3-entities/sites/api/updateSubdomain";
import { requireSiteAccess } from "@/4-shared/lib/requireSiteAccess";
import { RouteContext, getParams } from "@/4-shared/lib/route-context";

export async function PATCH(
  req: Request,
  context: RouteContext<{ id: string }>,
) {
  try {
    const { id } = await getParams(context);

    const access = await requireSiteAccess(id);
    if (!access.ok) {
      return Response.json(
        { message: access.message },
        { status: access.status },
      );
    }

    const body = await req.json();
    const { subdomain } = body;
    if (!subdomain) {
      return Response.json({ message: "Missing subdomain" }, { status: 400 });
    }
    await updateSubdomain(id, subdomain);
    return Response.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return Response.json({ message }, { status: 400 });
  }
}
