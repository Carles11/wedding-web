export function buildPathWithQuery(pathname: string, query: string): string {
  return query ? `${pathname}?${query}` : pathname;
}

export function buildBuilderUrl(lang: string, query: string): string {
  return buildPathWithQuery(`/${lang}/builder`, query);
}

export function buildSignupUrl(lang: string, query: string): string {
  return buildPathWithQuery(`/${lang}/auth/signup`, query);
}
