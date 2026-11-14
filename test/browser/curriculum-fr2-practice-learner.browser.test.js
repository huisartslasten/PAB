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
  const denominatorSlot = await page.evaluate(async () => {
    const { renderFractionPracticeExpression } = await import("/pacogo-engine/fraction-practice-equation.js");
    const mount = document.createElement("div");
    document.body.append(mount);
    renderFractionPracticeExpression({ mount, expression: "1/2 = 3/?", inputLabels: ["Ontbrekende noemer"] });
    const input = mount.querySelector("input");
    const style = getComputedStyle(input);
    return {
      slot: input.parentElement.className,
      width: parseFloat(style.width),
      fontSize: style.fontSize,
      fractionFontSize: getComputedStyle(mount.querySelector(".fraction-practice-fraction")).fontSize
    };
  });
  expect(denominatorSlot.slot).toBe("fraction-practice-denominator fraction-practice-inline-field");
  expect(denominatorSlot.width).toBe(60);
  expect(denominatorSlot.fontSize).toBe(denominatorSlot.fractionFontSize);
  await expect(page.locator("#learnerSetup h1")).toHaveText("Wie gaat breuken oefenen?");
  await page.getByRole("button", { name: "Leerling kiezen: Leerling A" }).click();
  await expect(page.locator("#exerciseCard h1")).toHaveText("Breuken die evenveel betekenen");
  await expect(page.locator("#exerciseCard .concept")).toHaveCount(0);
  await expect(page.locator("#exerciseCard .exercise-context-row")).toBeVisible();
  await expect(page.locator("#openFractionDiagnostic")).toBeVisible();
  await expect(page.locator("#exerciseCard .exercise-context-row #openFractionDiagnostic")).toHaveCount(1);
  await expect(page.locator("#exerciseCard > .pacogo-fraction-practice-template")).toHaveCount(1);
  await expect(page.locator("#exerciseCard .pacogo-fraction-practice-template__work #fractionInterface")).toBeVisible();
  await expect(page.locator("#exerciseCard .pacogo-fraction-practice-template__controls .pacogo-fraction-interface__submit")).toBeVisible();
  expect(await page.locator("#exerciseCard").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#prompt")).toHaveText("Kies de breuk die evenveel blauw laat zien.");
  await expect(page.locator("#fractionInterface .pacogo-fraction-interface__target")).toBeVisible();
  await expect(page.locator("#fractionInterface .pacogo-fraction-interface__target .pacogo-fraction-representation--area")).toBeVisible();
  await expect(page.locator("#fractionInterface .pacogo-fraction-interface__target .pacogo-fraction-representation--symbolic")).toHaveCount(1);
  await expect(page.locator("#fractionInterface .pacogo-fraction-interface__option")).toHaveCount(2);
  await expect(page.locator("#fractionInterface .pacogo-fraction-interface__option").first()).toBeVisible();
  await expect(page.locator(".pacogo-fraction-interface__target .pacogo-fraction-representation--area")).toHaveCount(1);
  await expect(page.locator(".pacogo-fraction-interface__option")).toHaveCount(2);
  await expect(page.locator("#progress")).toContainText("0 afgerond");
  await expect(page.locator("#feedback")).toBeHidden();

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
  await expect(page.getByRole("button", { name: "Volgende oefening" })).toBeVisible();
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#progress")).toContainText("2 afgerond");
  await page.locator(".pacogo-fraction-interface__option").nth(0).click();
  await page.getByRole("button", { name: "Controleren" }).click();
  await page.getByRole("button", { name: "Bekijk resultaat" }).click();
  await expect(page.locator("#resultCard h1")).toHaveText("Oefenronde afgerond");

  await page.getByRole("button", { name: "Zelf een gelijkwaardige breuk maken" }).click();
  await expect(page.locator("#constructionCard")).toBeVisible();
  await expect(page.locator("#constructionCard > .pacogo-fraction-practice-template")).toHaveCount(1);
  await expect(page.locator("#constructionCard .pacogo-fraction-practice-template__work #constructionEquation")).toHaveCount(1);
  await expect(page.locator("#constructionCard .pacogo-fraction-practice-template__controls #constructionInput")).toHaveCount(1);
  expect(await page.locator("#constructionCard").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#constructionTarget .pacogo-fraction-representation--area")).toHaveCount(1);
  await expect(page.locator("#constructionEquation .fraction-practice-equation")).toHaveAttribute("data-expression", "1/2 = ?/4");
  await expect(page.locator("#constructionEquation input")).toHaveCount(1);
  await expect(page.locator("#constructionInput input")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Vul de teller in" })).toHaveValue("");
  await page.getByRole("textbox", { name: "Vul de teller in" }).click();
  await page.keyboard.type("2");
  await expect(page.getByRole("textbox", { name: "Vul de teller in" })).toHaveValue("2");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("12");
  await expect(page.getByRole("textbox", { name: "Vul de teller in" })).toHaveValue("12");
  await expect(page.getByRole("textbox", { name: "Vul de teller in" })).toHaveCSS("width", "60px");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("");
  await expect(page.locator("#constructionPrompt")).toContainText("noemer 4");

  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("1");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#constructionFeedback")).toContainText("Vergelijk de hoeveelheid blauw");
  await expect(page.locator("#constructionProgress")).toContainText("0 van 3");
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#constructionFeedback")).toContainText("betekent evenveel");
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#constructionEquation .fraction-practice-equation")).toHaveAttribute("data-expression", "1/3 = ?/6");
  await expect(page.locator("#constructionEquation input")).toHaveCount(1);
  await expect(page.locator("#constructionInput input")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende oefening" }).click();

  await expect(page.locator("#constructionEquation .fraction-practice-equation")).toHaveAttribute("data-expression", "2/3 = ?/6");
  await expect(page.locator("#constructionEquation input")).toHaveCount(1);
  await expect(page.locator("#constructionInput input")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Vul de teller in" }).fill("4");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk afronding" }).click();
  await expect(page.locator("#constructionFeedback")).toContainText("geen formele beoordeling");

  await page.getByRole("button", { name: "Oefenen met breuken optellen" }).click();
  await expect(page.locator("#additionPracticeCard")).toBeVisible();
  await expect(page.locator("#additionPracticeCard > .pacogo-fraction-practice-template")).toHaveCount(1);
  await expect(page.locator("#additionPracticeCard .pacogo-fraction-practice-template__work #additionExpression")).toHaveCount(1);
  await expect(page.locator("#additionPracticeCard .pacogo-fraction-practice-template__controls #additionInput")).toHaveCount(1);
  expect(await page.locator("#additionPracticeCard").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#additionVisual .pacogo-fraction-representation--area")).toHaveCount(2);
  await expect(page.locator("#additionVisual .pacogo-fraction-operation")).toHaveCount(1);
  await expect(page.locator("#additionVisual .pacogo-fraction-operation__symbol")).toHaveText("+");
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

  await expect(page.locator("#additionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "4/12 + 3/12 = ?/12");
  await expect(page.locator("#additionExpression .fraction-practice-fraction")).toHaveCount(3);
  await expect(page.locator("#additionExpression input")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Teller van de som" }).fill("8");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#additionFeedback")).toContainText("Controleer de optelling");
  await page.getByRole("textbox", { name: "Teller van de som" }).fill("7");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk uitkomst" }).click();
  await expect(page.locator("#additionExpression")).toContainText("Jouw uitkomst:");
  await expect(page.locator("#additionExpression .pacogo-fraction-representation--symbolic")).toHaveCount(1);
  expect(await page.locator("#additionExpression").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await page.getByRole("button", { name: "Oefen met vijftien tienden" }).click();
  await expect(page.locator("#resultFormCard")).toBeVisible();
  await expect(page.locator("#resultFormCard > .pacogo-fraction-practice-template")).toHaveCount(1);
  await expect(page.locator("#resultFormCard .pacogo-fraction-practice-template__work #resultFormExpression")).toHaveCount(1);
  await expect(page.locator("#resultFormCard .pacogo-fraction-practice-template__controls #resultFormInput")).toHaveCount(1);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-representation--symbolic")).toHaveCount(1);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-answer__fraction")).toHaveCount(2);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-answer__simplified")).toBeHidden();
  await expect(page.locator("#resultFormInput .pacogo-fraction-answer__controls")).toBeVisible();
  expect(await page.locator("#resultFormCard").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-answer")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Heel getal toevoegen" })).not.toBeChecked();
  await expect(page.getByRole("textbox", { name: "Heel getal" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Vereenvoudigen" })).toBeVisible();
  await expect(page.locator("#resultFormInput .pacogo-fraction-answer__controls")).toContainText("Heel getal toevoegen");
  await page.getByRole("button", { name: "Vereenvoudigen" }).click();
  await expect(page.locator("#resultFormExpression .pacogo-fraction-answer__simplified")).toBeVisible();
  const answerLayout = await page.locator("#resultFormExpression .pacogo-fraction-answer__line").evaluate(line => {
    const original = line.querySelector(".pacogo-fraction-answer__fraction");
    const simplified = line.querySelector(".pacogo-fraction-answer__simplified");
    return {
      display: getComputedStyle(line).display,
      originalRight: original.getBoundingClientRect().right,
      simplifiedLeft: simplified.getBoundingClientRect().left
    };
  });
  expect(answerLayout.display).toBe("flex");
  expect(answerLayout.simplifiedLeft).toBeGreaterThan(answerLayout.originalRight);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-answer__simplified")).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.getByRole("textbox", { name: "Vereenvoudigde teller" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Vereenvoudigde noemer" })).toBeVisible();
  await page.getByRole("checkbox", { name: "Heel getal toevoegen" }).check();
  await expect(page.getByRole("textbox", { name: "Heel getal" })).toBeVisible();
  const resultNumerator = page.getByRole("textbox", { name: "Teller", exact: true });
  const resultDenominator = page.getByRole("textbox", { name: "Noemer", exact: true });
  await resultNumerator.click();
  await page.keyboard.type("15");
  await expect(resultNumerator).toHaveValue("15");
  await expect(resultNumerator).toHaveCSS("width", "60px");
  await resultDenominator.click();
  await page.keyboard.type("10");
  await expect(resultDenominator).toHaveValue("10");
  await expect(resultDenominator).toHaveCSS("width", "60px");
  await expect(resultNumerator).toHaveCSS("height", "36px");
  await expect(resultNumerator).toHaveCSS("min-height", "36px");
  await expect(resultNumerator).toHaveCSS("border-radius", "7px");
  await expect(resultNumerator).toHaveCSS("padding-top", "0px");
  await expect(resultNumerator).toHaveCSS("font-size", "24px");
  await page.getByRole("textbox", { name: "Heel getal" }).fill("1");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormFeedback")).toContainText("Vul de getoonde velden met hele getallen in.");
  await page.getByRole("textbox", { name: "Vereenvoudigde teller" }).fill("1");
  await page.getByRole("textbox", { name: "Vereenvoudigde noemer" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormFeedback")).toContainText("Dit antwoord heeft nog niet dezelfde waarde als vijftien tienden.");
  await resultNumerator.fill("5");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#resultFormExpression .pacogo-fraction-mixed-number")).toHaveCount(2);
  await expect(page.locator("#resultFormExpression .pacogo-fraction-representation--symbolic")).toHaveCount(3);
  expect(await page.locator("#resultFormExpression").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#resultFormFeedback")).toContainText("zelf gekozen");

  await page.getByRole("button", { name: "Terug naar optellen" }).click();
  await page.getByRole("button", { name: "Oefenen met breuken aftrekken" }).click();
  await expect(page.locator("#subtractionPracticeCard")).toBeVisible();
  await expect(page.locator("#subtractionPracticeCard > .pacogo-fraction-practice-template")).toHaveCount(1);
  await expect(page.locator("#subtractionPracticeCard .pacogo-fraction-practice-template__work #subtractionExpression")).toHaveCount(1);
  await expect(page.locator("#subtractionPracticeCard .pacogo-fraction-practice-template__controls #subtractionInput")).toHaveCount(1);
  expect(await page.locator("#subtractionPracticeCard").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);
  await expect(page.locator("#subtractionVisual .pacogo-fraction-representation--area")).toHaveCount(2);
  await expect(page.locator("#subtractionVisual .pacogo-fraction-operation")).toHaveCount(1);
  await expect(page.locator("#subtractionVisual .pacogo-fraction-operation__symbol")).toHaveText("−");
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
  await expect(page.locator("#subtractionFeedback")).toContainText("De hoeveelheid moet gelijk blijven");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 1/2" }).fill("10");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "2/5 = ?/20");
  await page.getByRole("textbox", { name: "Nieuwe teller voor 2/5" }).fill("7");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("textbox", { name: "Nieuwe teller voor 2/5" }).fill("8");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Volgende stap" }).click();
  await expect(page.locator("#subtractionExpression .fraction-practice-equation")).toHaveAttribute("data-expression", "10/20 − 8/20 = ?/20");
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction")).toHaveCount(3);
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(0)).toContainText("10");
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(0)).toContainText("20");
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(1)).toContainText("8");
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(1)).toContainText("20");
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(2).locator(".fraction-practice-numerator input")).toHaveCount(1);
  await expect(page.locator("#subtractionExpression .fraction-practice-fraction").nth(2).locator(".fraction-practice-denominator")).toHaveText("20");
  await page.getByRole("textbox", { name: "Verschil van de tellers" }).fill("3");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await expect(page.locator("#subtractionFeedback")).toContainText("Controleer de aftrekking");
  await page.getByRole("textbox", { name: "Verschil van de tellers" }).fill("2");
  await page.getByRole("button", { name: "Controleren" }).last().click();
  await page.getByRole("button", { name: "Bekijk uitkomst" }).click();
  await expect(page.locator("#subtractionExpression")).toContainText("Jouw uitkomst:");
  await expect(page.locator("#subtractionExpression .pacogo-fraction-representation--symbolic")).toHaveCount(1);
  expect(await page.locator("#subtractionExpression").innerText()).not.toMatch(/\d+\s*\/\s*\d+/);

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
  expect(JSON.parse(resultFormState[1])).toEqual({
    schemaVersion: 2,
    completed: true,
    responses: [{
      classification: "valid",
      values: {
        wholeNumberEnabled: true,
        wholeNumber: "1",
        numerator: "5",
        denominator: "10",
        simplified: true,
        simplifiedNumerator: "1",
        simplifiedDenominator: "2"
      }
    }]
  });
  expect(resultFormState[1]).not.toContain(learnerKey);
  const subtractionState = state.local.find(([key]) => key.startsWith("pacogo:fraction-subtraction-practice:"));
  expect(subtractionState[0]).toContain(learnerKey);
  for (const raw of ['"rawValue":"4"','"rawValue":"20"','"rawValue":"9"','"rawValue":"10"','"rawValue":"7"','"rawValue":"8"','"rawValue":"3"','"rawValue":"2"']) expect(subtractionState[1]).toContain(raw);
  expect(subtractionState[1]).not.toContain(learnerKey);

  expect(pageErrors).toEqual([]);
});
