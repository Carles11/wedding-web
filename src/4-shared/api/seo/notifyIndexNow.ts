export async function notifyIndexNow(urls: string[], host: string) {
  if (!urls.length || !process.env.INDEXNOW_KEY) return;

  const BING_KEY = process.env.INDEXNOW_KEY;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: host,
        key: BING_KEY,
        // Pointing to your central verification file on the main domain
        keyLocation: `https://weddweb.com/${BING_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (!response.ok) {
      console.error(
        `IndexNow Error: ${response.status} ${await response.text()}`,
      );
    }
  } catch (err) {
    console.error("IndexNow Network Error:", err);
  }
}
