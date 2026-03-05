export async function patchDomainToRedirect(
  fromDomain: string,
  destinationDomain: string,
) {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
  const url = `https://api.vercel.com/v9/domains/${fromDomain}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redirect: { destination: `https://${destinationDomain}`, type: 308 },
    }),
  });
  if (!res.ok)
    throw new Error((await res.json()).error?.message || "Redirect failed");
}
