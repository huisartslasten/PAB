import { test, expect } from "@playwright/test";

async function mountPractice(page, representation) {
  await page.goto("http://127.0.0.1:4173/skills.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async representationValue => {
    const { createFractionQuantitySubtractionPractice } =
      await import("/pacogo-engine/fraction-quantity-subtraction-practice.js");
    const mount = document.createElement("main");
    mount.id = "fraction-quantity-subtraction-test-mount";
    document.body.replaceChildren(mount);
    const practice = createFractionQuantitySubtractionPractice({
      mount,
      tasks: Array.from({ length: 10 }, (_, index) => ({
        id: "quantity-subtraction-" + (index + 1),
        wholeUnits: 2,
        subtraction: { whole: 0, numerator: 1, denominator: 2 }
      })),
      representation: representationValue
    });
    window.__fractionQuantitySubtractionPractice = practice;
  }, representation);
}

for (const representation of ["pie", "bar"]) {
  test("central visual subtraction practice " + representation + " uses the shared fraction template and explicit task progression", async ({ page }) => {
    await mountPractice(page, representation);

    await expect(page.locator('[data-component="fraction-practice-template"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Visueel aftrekken" })).toBeVisible();
    await expect(page.getByText("Som 1 van 10 · 0 afgerond")).toBeVisible();
    await expect(page.getByLabel("Aftreksom", { exact: true })).toBeVisible();
    await expect(page.locator(".fraction-quantity-subtraction-expression--visual")).toBeVisible();
    await expect(page.locator(".fraction-quantity-subtraction-expression--visual .pacogo-fraction-quantity__annotation")).toHaveCount(3);
    await expect(page.locator(".pacogo-fraction-quantity")).toHaveAttribute("data-representation", representation);
    await expect(page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotation")).toHaveCount(2);

    await page.getByRole("button", { name: "Controleren" }).click();
    await expect(page.getByRole("alert")).toContainText("Nog niet");
    await expect(page.getByRole("button", { name: "Volgende som" })).toHaveCount(0);

    await page.getByRole("button", { name: "Selecteer eenheid 1" }).click();
    await page.getByRole("button", { name: "2 gelijke delen" }).click();
    const firstUnit = page.locator(".pacogo-fraction-quantity__annotated-unit").first();
    const segment = representation === "pie"
      ? firstUnit.locator('.pacogo-fraction-quantity__sector[data-segment-index="0"]')
      : firstUnit.locator('.pacogo-fraction-quantity__segment[data-segment-index="0"]');
    await segment.focus();
    await segment.press("Enter");
    await expect(page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotation").first()).toHaveAttribute("aria-label", "1 van 2 delen gevuld");
    await expect(page.getByRole("alert")).toHaveCount(0);

    const check = page.getByRole("button", { name: "Controleren" });
    await check.focus();
    await check.press("Enter");
    await expect(page.locator(".fraction-practice-feedback.is-correct")).toContainText("De overgebleven hoeveelheid klopt");
    await expect(page.getByRole("button", { name: "Volgende som" })).toBeVisible();
    await expect(page.getByText("Som 1 van 10 · 0 afgerond")).toBeVisible();

    const next = page.getByRole("button", { name: "Volgende som" });
    await next.focus();
    await next.press("Enter");
    await expect(page.getByText("Som 2 van 10 · 1 afgerond")).toBeVisible();
    await expect(page.locator(".pacogo-fraction-quantity")).toHaveAttribute("data-representation", representation);
    await expect(page.locator(".pacogo-fraction-quantity__annotation")).toHaveCount(2);
    await expect(page.locator('[data-component="fraction-practice-template"]')).toHaveCount(1);
  });
}
