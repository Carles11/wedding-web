import { serve } from "std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { action, content, targetLanguages, context, tone } =
      await req.json();

    const API_KEY = Deno.env.get("GOOGLE_AI_KEY");

    // 1. Change the model string to just the name
    const MODEL = "gemini-3.1-flash-lite";
    // 2. Ensure the URL looks exactly like this (notice the "models/" position)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = `Translate or generate wedding content. 
      Action: ${action}. 
      Tone: ${tone}. 
      Target Languages: ${targetLanguages.join(",")}. 
      Context: ${context}. 
      Content: ${JSON.stringify(content)}. 
      Return ONLY a valid JSON object with language codes as keys. Do not include markdown formatting or backticks.`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json", // Gemini 3.1 supports this perfectly
        },
      }),
    });
    const aiData = await geminiRes.json();
    // Check if Gemini returned an error
    if (aiData.error) {
      return new Response(
        JSON.stringify({ error: `Gemini Error: ${aiData.error.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const resultText = aiData.candidates[0].content.parts[0].text;

    // Clean up markdown if the AI includes it (```json ... ```)
    const cleanedJson = resultText.replace(/```json|```/g, "").trim();

    return new Response(
      JSON.stringify({ ok: true, data: JSON.parse(cleanedJson) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
