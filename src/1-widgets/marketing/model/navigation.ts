export function buildLangQuery(
  searchParams: URLSearchParams,
  lang: string,
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set("lang", lang);
  return params.toString();
}

export function buildPathWithQuery(pathname: string, query: string): string {
  return query ? `${pathname}?${query}` : pathname;
}

export function buildBuilderUrl(query: string): string {
  return buildPathWithQuery("/builder", query);
}

export function buildSignupUrl(query: string): string {
  return buildPathWithQuery("/auth/signup", query);
}
