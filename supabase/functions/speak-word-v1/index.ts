import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";

const languageInstructions: Record<string, string> = {
  nl: "Spreek in natuurlijk, duidelijk Nederlands. Spreek rustig en alsof je een woord voor een basisschoolleerling voorleest.",
  en: "Speak in natural, clear English. Speak calmly and clearly as if reading a word to a primary school student.",
  es: "Habla en español natural y claro. Habla con calma y claridad, como si leyeras una palabra a un alumno de primaria.",
  fr: "Parle en français naturel et clair. Parle calmement et clairement, comme si tu lisais un mot à un élève de primaire.",
  de: "Sprich natürliches, klares Deutsch. Sprich ruhig und deutlich, als würdest du einem Grundschulkind ein Wort vorlesen.",
  pt: "Fale em português natural e claro. Fale com calma e clareza, como se estivesse lendo uma palavra para uma criança do ensino fundamental."
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return json({ error: "OPENAI_API_KEY ontbreekt in Supabase TEST." }, 500);

    const body = await req.json();
    const text = String(body?.text ?? "").trim();
    const language = String(body?.language ?? "nl").trim().toLowerCase();

    if (!text) return json({ error: "Geen tekst ontvangen." }, 400);

    const instructions = languageInstructions[language] ?? languageInstructions.nl;
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text.slice(0, 500),
        instructions,
        response_format: "mp3"
      })
    });

    if (!response.ok) {
      const raw = await response.text();
      console.error("OPENAI_TTS_ERROR", response.status, raw.slice(0, 1500));
      return json({
        error: "De OpenAI-stem kon niet worden gemaakt.",
        details: "HTTP " + response.status
      }, 502);
    }

    const audio = await response.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("OPENAI_TTS_FUNCTION_ERROR", error instanceof Error ? error.stack || error.message : String(error));
    return json({ error: "De OpenAI-stem kon niet worden afgespeeld." }, 500);
  }
});
