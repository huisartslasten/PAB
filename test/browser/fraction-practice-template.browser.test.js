import { test, expect } from "@playwright/test";

test("the central Fraction Practice Template checks an answer with Enter", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/skills.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const { createFractionPracticeTemplate } =
      await import("/pacogo-engine/fraction-practice-template.js");
    const mount = document.createElement("main");
    mount.id = "fraction-practice-template-keyboard-test";
    document.body.replaceChildren(mount);
    const template = createFractionPracticeTemplate({ mount });
    const answer = document.createElement("input");
    answer.type = "text";
    answer.setAttribute("aria-label", "Teller");
    const check = document.createElement("button");
    check.type = "button";
    check.textContent = "Controleren";
    window.__fractionCheckCount = 0;
    check.addEventListener("click", () => { window.__fractionCheckCount += 1; });
    template.workArea.append(answer);
    template.actionsArea.append(check);
    answer.focus();
  });

  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => window.__fractionCheckCount)).toBe(1);
});

test("Enter in an explanation textarea keeps its normal newline behavior", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/skills.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const { createFractionPracticeTemplate } =
      await import("/pacogo-engine/fraction-practice-template.js");
    const mount = document.createElement("main");
    document.body.replaceChildren(mount);
    const template = createFractionPracticeTemplate({ mount });
    const explanation = document.createElement("textarea");
    const check = document.createElement("button");
    check.type = "button";
    check.textContent = "Controleren";
    window.__fractionCheckCount = 0;
    check.addEventListener("click", () => { window.__fractionCheckCount += 1; });
    template.workArea.append(explanation);
    template.actionsArea.append(check);
    explanation.focus();
  });

  await page.keyboard.type("eerste regel");
  await page.keyboard.press("Enter");
  await page.keyboard.type("tweede regel");
  await expect(page.locator("textarea")).toHaveValue("eerste regel\ntweede regel");
  await expect.poll(() => page.evaluate(() => window.__fractionCheckCount)).toBe(0);
});

test("Enter does not activate a missing or disabled Controleren button", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/skills.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const { createFractionPracticeTemplate } =
      await import("/pacogo-engine/fraction-practice-template.js");
    const mount = document.createElement("main");
    document.body.replaceChildren(mount);
    const template = createFractionPracticeTemplate({ mount });
    const answer = document.createElement("input");
    const check = document.createElement("button");
    check.type = "button";
    check.textContent = "Controleren";
    check.disabled = true;
    window.__fractionCheckCount = 0;
    check.addEventListener("click", () => { window.__fractionCheckCount += 1; });
    template.workArea.append(answer);
    template.actionsArea.append(check);
    answer.focus();
  });

  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => window.__fractionCheckCount)).toBe(0);
});
