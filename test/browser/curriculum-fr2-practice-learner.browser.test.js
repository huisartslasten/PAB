import { test, expect } from "@playwright/test";

const pageUrl = "http://127.0.0.1:4173/curriculum-fr2-practice-learner.html";
const parentUserId = "5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09";
const learnerKey = "123e4567-e89b-42d3-a456-426614174000";

test("FR2 learner practice is visual, learner-isolated and does not write formal evidence", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  await page.addInitScript(({ parentUserId, learnerKey }) => {
    const calls = [];
    const profiles = [{ learner_key: learnerKey, display_name: "Leerling A" }];
    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parentUserId } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from(table) {
        const query = {
          select() { calls.push(["select", table]); return query; },
          order() { return query; },
          then(resolve, reject) {
            const data = table === "learner_profiles" ? profiles : [];
            return Promise.resolve({ data, error: null }).then(resolve, reject);
          }
        };
        return query;
      },
      rpc: async (name) => {
        calls.push(["rpc", name]);
        return { data: null, error: new Error("Unexpected RPC call") };
      }
    };
    window.__pacoPracticeTest = { calls };
    window.__pacoSupabaseStub = { createClient: () => db };
  }, { parentUserId, learnerKey });

  await page.route("https://cdn.jsdelivr.net/**", route => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "window.supabase = window.__pacoSupabaseStub;"
  }));

  await page.goto(pageUrl);
  await expect(page.locator("#learnerSetup h1")).toHaveText("Wie gaat breuken oefenen?");
  await page.getByRole("button", { name: "Leerling kiezen: Leerling A" }).click();
  await expect(page.locator("#exerciseCard h1")).toHaveText("Breuken die evenveel betekenen");
  await expect(page.locator(".pacogo-fraction-interface__target .pacogo-fraction-representation--area")).toHaveCount(1);
  await expect(page.locator(".pacogo-fraction-interface__option")).toHaveCount(2);
  await expect(page.locator("#progress")).toContainText("0 afgerond");

  await page.locator(".pacogo-fraction-interface__option").nth(0).click();
  await page.getByRole("button", { name: "Controleren" }).click();
  await expect(page.locator("#feedback")).toContainText("De blauwe hoeveelheid is even groot");
  await expect(page.locator("#comparison .comparison-item")).toHaveCount(2);
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#progress")).toContainText("1 afgerond");
  await expect(page.locator(".pacogo-fraction-interface__option .pacogo-fraction-representation--symbolic")).toHaveCount(2);
  await expect(page.locator(".practice-option-model")).toHaveCount(2);
  await expect(page.locator(".practice-option-model .pacogo-fraction-representation--area")).toHaveCount(2);
  await page.locator(".pacogo-fraction-interface__option").nth(1).click();
  await page.getByRole("button", { name: "Controleren" }).click();
  await expect(page.locator("#feedback")).toContainText("Deze optie laat niet evenveel blauw zien");
  await page.getByRole("button", { name: "Nog een keer proberen" }).click();
  await page.locator(".pacogo-fraction-interface__option").nth(0).click();
  await page.getByRole("button", { name: "Controleren" }).click();
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#progress")).toContainText("2 afgerond");
  await page.locator(".pacogo-fraction-interface__option").nth(0).click();
  await page.getByRole("button", { name: "Controleren" }).click();
  await page.getByRole("button", { name: "Bekijk resultaat" }).click();
  await expect(page.locator("#resultCard h1")).toHaveText("Oefenronde afgerond");

  await page.getByRole("button", { name: "Zelf een gelijkwaardige breuk maken" }).click();
  await expect(page.locator("#constructionCard")).toBeVisible();
  await expect(page.locator("#constructionTarget .pacogo-fraction-representation--area")).toHaveCount(1);
  await expect(page.locator("#constructionEquation")).toContainText("1/2=?/4");
  await expect(page.getByRole("textbox", { name: "Vul de teller in" })).toHaveValue("");
  await expect(page.locator("#constructionPrompt")).toContainText("noemer 4");

  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("1");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#constructionFeedback")).toContainText("Vergelijk de hoeveelheid blauw");
  await expect(page.locator("#constructionProgress")).toContainText("0 van 3");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#constructionFeedback")).toContainText("betekent evenveel");
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#constructionEquation")).toContainText("1/3=?/6");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#constructionEquation")).toContainText("2/3=?/6");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("4");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk afronding" }).click();
  await expect(page.locator("#constructionFeedback")).toContainText("geen formele beoordeling");

  await page.getByRole("button", { name: "Oefenen met breuken optellen" }).click();
  await expect(page.locator("#additionPracticeCard")).toBeVisible();
  await expect(page.locator("#additionVisual .pacogo-fraction-representation--area")).toHaveCount(2);
  await expect(page.locator("#additionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1/3 + 1/4 → noemer ?");
  await expect(page.locator("#additionProgress")).toContainText("Stap 1 van 4");
  await expect(page.locator("#additionExpression input")).toHaveCount(1);
  await expect(page.locator("#additionInput input")).toHaveCount(0);

  await page.getByRole("textbox", { name: "Gemeenschappelijke noemer" }).fill("6");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#additionFeedback")).toContainText("deelbaar zijn door 3 én door 4");
  await expect(page.locator("#additionProgress")).toContainText("Stap 1 van 4");
  await page.getByRole("textbox", { name: "Gemeenschappelijke noemer" }).fill("12");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();

  await expect(page.locator("#additionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1/3 = ?/12");
  await expect(page.locator("#additionExpression input")).toHaveCount(1);
  await expect(page.locator("#additionInput input")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Nieuwe teller voor 1/3" }).fill("4");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();

  await expect(page.locator("#additionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1/4 = ?/12");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 1/4" }).fill("3");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();

  await expect(page.locator("#additionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "4 + 3 = ?");
  await page.getByRole("textbox", { name: "Som van de tellers" }).fill("8");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#additionFeedback")).toContainText("Controleer de optelling");
  await page.getByRole("textbox", { name: "Som van de tellers" }).fill("7");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk uitkomst" }).click();
  await expect(page.locator("#additionExpression")).toHaveText("Jouw uitkomst: 7/12");
  await page.getByRole("button", { name: "Oefen gemengd getal 15/10" }).click();
  await expect(page.locator("#resultFormCard")).toBeVisible();
  await expect(page.locator("#resultFormExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "15/10 = ? ?/?");
  await expect(page.locator("#resultFormExpression input")).toHaveCount(3);
  await page.getByRole("textbox", { name: "Heel getal" }).fill("1");
  await page.getByRole("textbox", { name: "Teller van het breukdeel" }).fill("4");
  await page.getByRole("textbox", { name: "Noemer van het breukdeel" }).fill("10");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormFeedback")).toContainText("Controleer het hele getal");
  await page.getByRole("textbox", { name: "Teller van het breukdeel" }).fill("5");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormFeedback")).toContainText("Kies nu zelf voor vereenvoudigen");
  await page.getByRole("button", { name: "Vereenvoudigen" }).click();
  await expect(page.locator("#resultFormExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1 5/10 = 1 ?/?");
  await expect(page.locator("#resultFormExpression input")).toHaveCount(2);
  await page.getByRole("textbox", { name: "Vereenvoudigde teller" }).fill("2");
  await page.getByRole("textbox", { name: "Vereenvoudigde noemer" }).fill("4");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormFeedback")).toContainText("nog niet volledig vereenvoudigd");
  await page.getByRole("textbox", { name: "Vereenvoudigde teller" }).fill("1");
  await page.getByRole("textbox", { name: "Vereenvoudigde noemer" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormExpression")).toHaveText("1 5/10 = 1 1/2");
  await expect(page.locator("#resultFormFeedback")).toContainText("eerst het gemengde getal gemaakt");

  const state = await page.evaluate(() => ({
    calls: window.__pacoPracticeTest.calls,
    local: Object.entries(localStorage).filter(([key]) => key.startsWith("pacogo:fraction-practice:") || key.startsWith("pacogo:fraction-construction-practice:") || key.startsWith("pacogo:fraction-addition-practice:") || key.startsWith("pacogo:fraction-result-form-practice:") || key.startsWith("pacogo:fraction-subtraction-practice:"))
  }));
  expect(state.calls.filter(call => call[0] === "rpc")).toEqual([]);
  expect(state.calls).toEqual([["select", "learner_profiles"]]);
  expect(state.local).toHaveLength(5);
  expect(state.local[0][0]).toContain(learnerKey);
  expect(state.local[0][1]).not.toContain("explanation");
  expect(state.local.find(([key]) => key.startsWith("pacogo:fraction-practice:"))[1]).not.toContain("response");
  const constructionState = state.local.find(([key]) => key.startsWith("pacogo:fraction-construction-practice:"));
  expect(constructionState[0]).toContain(learnerKey);
  expect(constructionState[1]).toContain('"rawNumerator":"1"');
  expect(constructionState[1]).toContain('"rawNumerator":"2"');
  expect(constructionState[1]).toContain('"rawNumerator":"4"');
  expect(constructionState[1]).not.toContain(learnerKey);
  const additionState = state.local.find(([key]) => key.startsWith("pacogo:fraction-addition-practice:"));
  expect(additionState[0]).toContain(learnerKey);
  expect(additionState[1]).toContain('"rawValue":"6"');
  expect(additionState[1]).toContain('"rawValue":"12"');
  expect(additionState[1]).toContain('"rawValue":"8"');
  expect(additionState[1]).toContain('"rawValue":"7"');
  expect(additionState[1]).not.toContain(learnerKey);
  const resultFormState = state.local.find(([key]) => key.startsWith("pacogo:fraction-result-form-practice:"));
  expect(resultFormState[0]).toContain(learnerKey);
  expect(resultFormState[1]).toContain('"rawValues":["1","4","10"]');
  expect(resultFormState[1]).toContain('"rawValues":["1","5","10"]');
  expect(resultFormState[1]).toContain('"rawValues":["2","4"]');
  expect(resultFormState[1]).toContain('"rawValues":["1","2"]');
  expect(resultFormState[1]).not.toContain(learnerKey);
  const subtractionState = state.local.find(([key]) => key.startsWith("pacogo:fraction-subtraction-practice:"));
  expect(subtractionState[0]).toContain(learnerKey);
  for (const raw of ['"rawValue":"4"','"rawValue":"20"','"rawValue":"9"','"rawValue":"10"','"rawValue":"7"','"rawValue":"8"','"rawValue":"3"','"rawValue":"2"']) expect(subtractionState[1]).toContain(raw);
  expect(subtractionState[1]).not.toContain(learnerKey);
  await page.getByRole("button", { name: "Terug naar optellen" }).click();
  await page.getByRole("button", { name: "Oefenen met breuken aftrekken" }).click();
  await expect(page.locator("#subtractionPracticeCard")).toBeVisible();
  await expect(page.locator("#subtractionVisual .pacogo-fraction-representation--area")).toHaveCount(2);
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1/2 − 2/5 → noemer ?");
  await page.getByRole("textbox", { name: "Gemeenschappelijke noemer" }).fill("4");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#subtractionFeedback")).toContainText("deelbaar zijn door 2 én door 5");
  await page.getByRole("textbox", { name: "Gemeenschappelijke noemer" }).fill("20");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "1/2 = ?/20");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 1/2" }).fill("9");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#subtractionFeedback")).toContainText("hoeveelheid gelijk");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 1/2" }).fill("10");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "2/5 = ?/20");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 2/5" }).fill("7");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("textbox", { name: "Nieuwe teller voor 2/5" }).fill("8");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "10 − 8 = ?");
  await page.getByRole("textbox", { name: "Verschil van de tellers" }).fill("3");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#subtractionFeedback")).toContainText("Controleer de aftrekking");
  await page.getByRole("textbox", { name: "Verschil van de tellers" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk uitkomst" }).click();
  await expect(page.locator("#subtractionExpression")).toHaveText("Jouw uitkomst: 2/20");
  expect(pageErrors).toEqual([]);
});
