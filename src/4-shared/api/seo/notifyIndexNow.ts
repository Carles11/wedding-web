export async function notifyIndexNow(urls: string[], host: string) {
  if (!urls.length || !process.env.INDEXNOW_KEY) return;

  const BING_KEY = process.env.INDEXNOW_KEY.trim().replace(/['"]/g, "");
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: host,
        key: BING_KEY,
        // 🚀 THE FIX: Point to the key on the TARGET host being submitted
        keyLocation: `https://${host}/${BING_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `IndexNow Error (${host}): ${response.status} ${errorText}`,
      );
    } else {
      console.log(
        `IndexNow Success for ${host}: ${urls.length} URLs submitted.`,
      );
    }
  } catch (err) {
    console.error("IndexNow Network Error:", err);
  }
}
