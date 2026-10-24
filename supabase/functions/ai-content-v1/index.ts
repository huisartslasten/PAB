const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const allowedTypes = new Set(["practice_target", "multiple_choice_distractors"]);
const allowedForms = new Set(["word","sentence","saying"]);
const AI_MODEL = "gpt-5.6-terra";
const multipleChoiceContextPolicies = Object.freeze({
  default: Object.freeze({ requiresQuestion: true }),
  dictation: Object.freeze({ requiresQuestion: false })
});
const multipleChoiceContextPolicy = (lessonType: string) => multipleChoiceContextPolicies[lessonType as keyof typeof multipleChoiceContextPolicies] ?? multipleChoiceContextPolicies.default;
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const text = (value: unknown, max = 2000) => String(value ?? "").trim().slice(0, max);
function normalize(body: any) {
  const learner = body?.learner ?? {};
  const lesson = body?.lesson ?? {};
  const constraints = body?.constraints ?? {};
  const contentType = text(body?.contentType, 100);
  if (!allowedTypes.has(contentType)) throw new Error("Unsupported content type.");

  if (contentType === "multiple_choice_distractors") {
    const optionCount = Math.min(8, Math.max(2, Math.round(Number(body?.optionCount) || 4)));
    return {
      contentType,
      locale: text(body?.locale, 20) || "nl-NL",
      question: text(body?.question, 1000),
      correctAnswer: text(body?.correctAnswer, 1000),
      subject: text(body?.subject, 100),
      subvak: text(body?.subvak, 100),
      context: {
        lessonType: text(body?.context?.lessonType, 100),
        theme: text(body?.context?.theme, 200)
      },
      optionCount,
      distractorCount: optionCount - 1
    };
  }

  const forms = Array.isArray(constraints.targetForms) ? constraints.targetForms.filter((v: unknown) => allowedForms.has(String(v))) : ["word","sentence","saying"];
  return {
    contentType,
    locale: text(body?.locale, 20) || "nl-NL",
    learner: { name: text(learner.name, 100), level: text(learner.level, 50) },
    lesson: { title: text(lesson.title, 200), subject: text(lesson.subject, 100), subvak: text(lesson.subvak, 100), questions: (Array.isArray(lesson.questions) ? lesson.questions : []).map((item: any) => ({ question: text(item?.question, 700), answer: text(item?.answer, 1000) })).filter((item: any) => item.question && item.answer).slice(0, 40) },
    constraints: { remainingQuestionCount: Math.max(0, Number(constraints.remainingQuestionCount) || 0), maxCharacters: Math.min(120, Math.max(1, Number(constraints.maxCharacters) || 80)), targetForms: forms.length ? forms : ["word"] }
  };
}
function promptFor(request: any) {
  if (request.contentType === "multiple_choice_distractors") {
    return [
      "Je bent de centrale educatieve contentgenerator van PAB.",
      "Genereer alleen plausibele FOUTE antwoordopties voor een bestaande multiple-choice vraag.",
      "Het door de gebruiker opgegeven correcte antwoord is al vastgesteld en mag NIET worden vervangen, aangepast of opnieuw gegenereerd.",
      "Gebruik de vraag, het correcte antwoord en de context om realistische afleiders te maken.",
      request.question ? `Vraag: ${request.question}` : "Vraag: (dicteecontext; gebruik het correcte woord als vaste referentie)",
      `Correct antwoord: ${request.correctAnswer}`,
      `Vak: ${request.subject || "onbekend"}`,
      `Subvak: ${request.subvak || "onbekend"}`,
      `Lescontext: ${JSON.stringify(request.context)}`,
      `Aantal foute opties: ${request.distractorCount}`,
      "Elke optie moet inhoudelijk anders zijn, plausibel klinken en duidelijk fout zijn voor deze vraag.",
      "Bij spelling/dictee: maak realistische bijna-goede spelfouten, maar gebruik nooit de correcte spelling.",
      "Geef ALLEEN JSON: {\"options\":[\"...\"]}"
    ].join("\n");
  }

  return [
    "Je bent de centrale educatieve contentgenerator van PAB.",
    "Maak veilige, positieve Nederlandse oefencontent voor basisschoolleerlingen.",
    "Maak een doelwoord, korte zin of leerzame spreuk voor een woordonthulspel.",
    "Gebruik de lesinhoud als onderwerpcontext. Geef geen antwoorden op de lesvragen.",
    `Leerling: ${request.learner.name || "onbekend"}`,
    `Niveau: ${request.learner.level || "onbekend"}`,
    `Les: ${request.lesson.title}`,
    `Vak: ${request.lesson.subject}`,
    `Subvak: ${request.lesson.subvak}`,
    `Nog correct te beantwoorden vragen: ${request.constraints.remainingQuestionCount}`,
    `Toegestane vormen: ${request.constraints.targetForms.join(", ")}`,
    `Maximum lengte: ${request.constraints.maxCharacters} tekens`,
    `Lescontext: ${JSON.stringify(request.lesson.questions)}`,
    "Regels: Zephon/beginner krijgt vooral eenvoudige concrete woorden en korte zinnen. Een hoger niveau mag iets uitdagender zijn. Als er weinig vragen over zijn, kies een kort doel. Een saying krijgt altijd een korte betekenis.",
    'Geef ALLEEN JSON: {"target":{"type":"word|sentence|saying","text":"...","meaning":"..."}}',
    "Gebruik meaning als lege string voor word en sentence."
  ].join("\n");
}
function parseOutput(raw: string, request: any) {
  let parsed: any;
  try { parsed = JSON.parse(raw); } catch { const match = raw.match(/\{[\s\S]*\}/); if (!match) throw new Error("Invalid JSON"); parsed = JSON.parse(match[0]); }

  if (request.contentType === "multiple_choice_distractors") {
    const rawOptions = Array.isArray(parsed?.options) ? parsed.options : [];
    const seen = new Set<string>();
    const options: string[] = [];
    const correct = request.correctAnswer.toLocaleLowerCase("nl-NL");
    for (const value of rawOptions) {
      const option = text(value, 500);
      const key = option.toLocaleLowerCase("nl-NL");
      if (!option || key === correct || seen.has(key)) continue;
      seen.add(key);
      options.push(option);
    }
    if (options.length < request.distractorCount) throw new Error("AI returned too few valid distractors");
    return { options: options.slice(0, request.distractorCount) };
  }

  const target = parsed?.target;
  const type = text(target?.type, 30);
  const targetText = text(target?.text, 120);
  const meaning = text(target?.meaning, 400);
  if (!allowedForms.has(type) || !targetText || (type === "saying" && !meaning)) throw new Error("Invalid target");
  return { target: { type, text: targetText, meaning } };
}
function upstreamErrorDetails(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    const error = parsed?.error ?? parsed;
    return {
      type: text(error?.type, 100),
      code: text(error?.code, 100),
      message: text(error?.message, 300)
    };
  } catch {
    return { type: "", code: "", message: "" };
  }
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return json({ error: "OPENAI_API_KEY ontbreekt in Supabase." }, 500);
    const request = normalize(await req.json());
    if (request.contentType === "multiple_choice_distractors" && (!request.correctAnswer || (multipleChoiceContextPolicy(request.context.lessonType).requiresQuestion && !request.question))) {
      return json({ error: "Multiple-choice context en correct antwoord zijn verplicht." }, 400);
    }
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: AI_MODEL, input: promptFor(request), max_output_tokens: 500 }) });
    const raw = await response.text();
    if (!response.ok) {
      const details = upstreamErrorDetails(raw);
      console.error("OpenAI upstream error", { status: response.status, type: details.type, code: details.code, message: details.message });
      return json({ error: "AI-contentgeneratie gaf een fout.", details: `HTTP ${response.status}` }, 502);
    }
    const data = JSON.parse(raw);
    const outputText = (data.output ?? []).flatMap((item: any) => item.content ?? []).filter((item: any) => item.type === "output_text" && typeof item.text === "string").map((item: any) => item.text).join("").trim();
    if (!outputText) return json({ error: "OpenAI gaf geen content terug." }, 502);
    try { return json(parseOutput(outputText, request)); } catch { return json({ error: "AI-content kon niet worden gelezen." }, 502); }
  } catch { return json({ error: "AI-contentgeneratie kon niet worden uitgevoerd." }, 500); }
});
