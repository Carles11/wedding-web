import { updateSubdomain } from "@/3-entities/sites/api/updateSubdomain";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // Some Next.js runtimes: context.params might be a promise!
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;
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
