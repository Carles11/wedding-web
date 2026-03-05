export type RouteContext<T extends Record<string, string>> = {
  params: T | Promise<T>;
};

export async function getParams<T extends Record<string, string>>(
  context: RouteContext<T>,
): Promise<T> {
  return await context.params;
}
