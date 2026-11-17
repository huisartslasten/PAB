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
    const firstUnit = page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotated-unit").first();
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
    await expect(page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotation")).toHaveCount(2);
    await expect(page.locator('[data-component="fraction-practice-template"]')).toHaveCount(1);
  });
}


async function mountSkillsRoute(page) {
  await page.goto("http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=whole-minus-greater-than-one-subtraction", {
    waitUntil: "domcontentloaded"
  });
  return page.evaluate(async () => {
    const { createSkillsRuntime } = await import("/src/features/skills/runtime.js");
    const { FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK: bank } =
      await import("/pacogo-engine/fraction-quantity-whole-minus-greater-than-one-task-bank.js");
    const templateMount = document.createElement("div");
    templateMount.id = "paco-template-mount";
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app,
      templateMount,
      context: { student: "Zyon", mode: "student" },
      domain: "fractions",
      topic: "aftrekken",
      exercise: "whole-minus-greater-than-one-subtraction",
      documentRef: document,
      navigate: () => {}
    });
    await runtime.mount();
    const card = document.querySelector(".fraction-quantity-subtraction-card");
    const visualExpression = document.querySelector(".fraction-quantity-subtraction-expression--visual");
    const interactiveModel = document.querySelector(".fraction-quantity-subtraction-model .pacogo-fraction-quantity");
    return {
      title: document.querySelector(".paco-template-main h1")?.textContent || "",
      centralPage: Boolean(document.querySelector(".paco-page-template")),
      fractionTemplateCount: document.querySelectorAll('[data-component="fraction-practice-template"]').length,
      taskCount: bank.tasks.length,
      taskIds: bank.tasks.map(task => task.id),
      taskRepresentations: bank.tasks.map(task => task.representation),
      firstTaskProgress: document.querySelector(".fraction-practice-progress")?.textContent || "",
      symbolicExpression: document.querySelector('.fraction-quantity-subtraction-expression[aria-label="Aftreksom"]')?.textContent || "",
      visualExpression: Boolean(visualExpression),
      visualRepresentation: visualExpression?.dataset.representation || "",
      visualUnitCount: visualExpression?.querySelectorAll(".fraction-quantity-subtraction-expression__term .pacogo-fraction-quantity__annotated-unit").length || 0,
      interactiveRepresentation: interactiveModel?.dataset.representation || "",
      annotationCount: interactiveModel?.querySelectorAll(".pacogo-fraction-quantity__annotation").length || 0,
      cardWidth: card?.getBoundingClientRect().width || 0,
      cardHeight: card?.getBoundingClientRect().height || 0,
      cardTop: card?.getBoundingClientRect().top || 0,
      cardBottom: card?.getBoundingClientRect().bottom || 0,
      pageMainTop: document.querySelector(".paco-template-main")?.getBoundingClientRect().top || 0,
      pageMainBottom: document.querySelector(".paco-template-main")?.getBoundingClientRect().bottom || 0,
      pageTemplateBottom: document.querySelector(".paco-page-template")?.getBoundingClientRect().bottom || 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight
    };
  });
}

test("real Skills route mounts the central fraction template and the approved ten-task bank", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const result = await mountSkillsRoute(page);
  console.log("FRACTION_SUBTRACTION_DESKTOP_LAYOUT", JSON.stringify(result));
  expect(result.title).toBe("Oefenen");
  expect(result.centralPage).toBe(true);
  expect(result.fractionTemplateCount).toBe(1);
  expect(result.taskCount).toBe(10);
  expect(result.taskIds).toHaveLength(10);
  expect(new Set(result.taskIds).size).toBe(10);
  expect(result.taskRepresentations).toEqual(["bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie"]);
  expect(result.firstTaskProgress).toContain("Som 1 van 10");
  expect(result.symbolicExpression).toContain("2");
  expect(result.visualExpression).toBe(true);
  expect(result.visualRepresentation).toBe("bar");
  expect(result.visualUnitCount).toBe(4);
  expect(result.interactiveRepresentation).toBe("bar");
  expect(result.annotationCount).toBe(2);
  expect(result.documentWidth).toBeLessThanOrEqual(result.viewportWidth);
});

test("real visual subtraction route has no horizontal overflow on a mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const result = await mountSkillsRoute(page);
  console.log("FRACTION_SUBTRACTION_MOBILE_LAYOUT", JSON.stringify(result));
  expect(result.title).toBe("Oefenen");
  expect(result.centralPage).toBe(true);
  expect(result.fractionTemplateCount).toBe(1);
  expect(result.visualRepresentation).toBe("bar");
  expect(result.interactiveRepresentation).toBe("bar");
  expect(result.documentWidth).toBeLessThanOrEqual(result.viewportWidth);
  expect(result.cardWidth).toBeGreaterThan(0);
  expect(result.cardWidth).toBeLessThanOrEqual(result.viewportWidth);
});
