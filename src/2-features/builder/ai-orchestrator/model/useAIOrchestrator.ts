import { createClient } from "@/4-shared/lib/supabase/client";
import { useState } from "react";

export function useAIOrchestrator(siteId: string) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const processContent = async (payload: {
    action: "translate" | "generate";
    content: any;
    targetLanguages: string[];
    context: string;
    tone?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-orchestrator",
        {
          body: { ...payload, site_id: siteId },
          // Remove the manual 'Authorization' header here.
          // supabase-js adds the user's JWT automatically.
        },
      );

      if (error) throw error;
      return data.data; // Mapped by lang: { en: {...}, es: {...} }
    } catch (err) {
      console.error("AI Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { processContent, loading };
}
