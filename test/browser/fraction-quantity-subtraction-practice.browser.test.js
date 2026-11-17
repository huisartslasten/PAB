import { test, expect } from "@playwright/test";

async function mountPractice(page, representation, subtraction = { whole: 1, numerator: 1, denominator: 2 }) {
  await page.goto("http://127.0.0.1:4173/skills.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(async ({ representationValue, subtractionValue }) => {
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
        subtraction: subtractionValue
      })),
      representation: representationValue
    });
    window.__fractionQuantitySubtractionPractice = practice;
  }, { representationValue: representation, subtractionValue: subtraction });
}

for (const representation of ["pie", "bar"]) {
  test("central visual subtraction practice " + representation + " uses the shared fraction template and explicit task progression", async ({ page }) => {
    await mountPractice(page, representation);

    await expect(page.locator('[data-component="fraction-practice-template"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Visueel aftrekken" })).toBeVisible();
    await expect(page.getByText("Som 1 van 10 · 0 afgerond")).toBeVisible();
    await expect(page.getByLabel("Aftreksom", { exact: true })).toBeVisible();
    await expect(page.locator(".fraction-quantity-subtraction-expression--visual")).toHaveCount(0);
    await expect(page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity__annotated-unit")).toHaveCount(2);
    await expect(page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity")).toHaveAttribute("data-representation", representation);
    await expect(page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity__annotation")).toHaveCount(2);
    await expect(page.locator(".fraction-quantity-subtraction-prompt")).toContainText("Trek nu 1 hele en een half af.");
    await expect(page.locator(".fraction-quantity-subtraction-prompt")).toContainText("Verdeel een eenheid in gelijke delen");
    await expect(page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity__annotated-unit")).toHaveCount(2);
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 2");
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 0");

    await page.getByRole("button", { name: "Controleren" }).click();
    await expect(page.getByRole("alert")).toContainText("Nog niet");
    await expect(page.getByRole("button", { name: "Volgende som" })).toHaveCount(0);

    const firstUnit = page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotated-unit").first();
    const wholeBar = representation === "pie"
      ? firstUnit.locator(".pacogo-fraction-quantity__sector")
      : firstUnit.locator(".pacogo-fraction-quantity__segment");
    await wholeBar.click();
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 1");
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 1");
    await wholeBar.click();
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 2");
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 0");
    await wholeBar.click();

    const secondUnit = page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotated-unit").nth(1);
    await secondUnit.getByRole("button", { name: "Verdelen van eenheid 2" }).click();
    await page.getByRole("button", { name: "4 delen" }).click();
    await expect(page.locator(".pacogo-fraction-quantity__controls")).toContainText("Andere verdeling");
    await page.getByRole("button", { name: "Andere verdeling" }).click();
    await secondUnit.getByRole("button", { name: "Verdelen van eenheid 2" }).click();
    await page.getByRole("button", { name: "2 delen" }).click();
    const segment = representation === "pie"
      ? secondUnit.locator('.pacogo-fraction-quantity__sector[data-segment-index="0"]')
      : secondUnit.locator('.pacogo-fraction-quantity__segment[data-segment-index="0"]');
    await segment.click();
    await expect(page.locator('[aria-label="Overgebleven hoeveelheid: 1 gedeeld door 2"]')).toBeVisible();
    await expect(page.locator('[aria-label="Afgetrokken hoeveelheid: 1 hele en 1 gedeeld door 2"]')).toBeVisible();
    await segment.click();
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 1");
    await expect(page.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 1");
    await segment.click();
    await expect(page.locator('[aria-label="Overgebleven hoeveelheid: 1 gedeeld door 2"]')).toBeVisible();
    await expect(page.locator('[aria-label="Afgetrokken hoeveelheid: 1 hele en 1 gedeeld door 2"]')).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(0);

    const check = page.getByRole("button", { name: "Controleren" });
    await check.focus();
    await check.press("Enter");
    await expect(page.locator(".fraction-practice-feedback.is-correct")).toContainText("precies de gevraagde hoeveelheid afgetrokken");
    await expect(page.locator('[aria-label="Overgebleven hoeveelheid: 1 gedeeld door 2"]')).toBeVisible();
    await expect(page.locator('[aria-label="Afgetrokken hoeveelheid: 1 hele en 1 gedeeld door 2"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Volgende som" })).toBeVisible();
    await expect(page.getByText("Som 1 van 10 · 0 afgerond")).toBeVisible();

    const next = page.getByRole("button", { name: "Volgende som" });
    await next.focus();
    await next.press("Enter");
    await expect(page.getByText("Som 2 van 10 · 1 afgerond")).toBeVisible();
    await expect(page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity")).toHaveAttribute("data-representation", representation);
    await expect(page.locator(".pacogo-fraction-quantity .pacogo-fraction-quantity__annotation")).toHaveCount(2);
    await expect(page.locator('[data-component="fraction-practice-template"]')).toHaveCount(1);
  });
}


async function mountSkillsRoute(page, { exercise = "whole-minus-greater-than-one-subtraction", seedStandardScroll = true } = {}) {
  await page.goto("http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=whole-minus-greater-than-one-subtraction", {
    waitUntil: "domcontentloaded"
  });
  return page.evaluate(async ({ exerciseValue, seedStandardScrollValue }) => {
    if (seedStandardScrollValue) window.sessionStorage.setItem("pacoGO:template-scroll", "480");
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
      exercise: exerciseValue,
      documentRef: document,
      navigate: () => {}
    });
    await runtime.mount();
    const card = document.querySelector(".fraction-quantity-subtraction-card");
    const pageTemplate = document.querySelector(".paco-page-template");
    const hero = document.querySelector(".paco-template-hero");
    const sidebarCard = document.querySelector(".paco-template-sidebar-card");
    const backButton = document.querySelector(".paco-template-back");
    const pageHeader = document.querySelector(".paco-template-page-header");
    const interactiveModel = document.querySelector(".fraction-quantity-subtraction-model .pacogo-fraction-quantity");
    return {
      title: document.querySelector(".paco-template-main h1")?.textContent || "",
      centralPage: Boolean(pageTemplate),
      layoutMode: pageTemplate?.dataset.layoutMode || "",
      practiceBodyClass: document.body.classList.contains("paco-template-practice-body"),
      heroDisplay: hero ? getComputedStyle(hero).display : "missing",
      sidebarCardDisplay: sidebarCard ? getComputedStyle(sidebarCard).display : "missing",
      backButtonVisible: Boolean(backButton && getComputedStyle(backButton).display !== "none" && backButton.getBoundingClientRect().width > 0 && backButton.getBoundingClientRect().height > 0),
      pageHeaderHeight: pageHeader?.getBoundingClientRect().height || 0,
      scrollY: window.scrollY,
      standardScrollSaved: window.sessionStorage.getItem("pacoGO:template-scroll"),
      fractionTemplateCount: document.querySelectorAll('[data-component="fraction-practice-template"]').length,
      taskCount: bank.tasks.length,
      taskIds: bank.tasks.map(task => task.id),
      taskRepresentations: bank.tasks.map(task => task.representation),
      firstTaskProgress: document.querySelector(".fraction-practice-progress")?.textContent || "",
      symbolicExpression: document.querySelector('.fraction-quantity-subtraction-expression[aria-label="Aftreksom"]')?.textContent || "",
      duplicateVisualExpression: Boolean(document.querySelector(".fraction-quantity-subtraction-expression--visual")),
      interactiveRepresentation: interactiveModel?.dataset.representation || "",
      annotationCount: interactiveModel?.querySelectorAll(".pacogo-fraction-quantity__annotation").length || 0,
      interactiveUnitCount: interactiveModel?.querySelectorAll(".pacogo-fraction-quantity__annotated-unit").length || 0,
      interactiveUnitWidth: interactiveModel?.querySelector(".pacogo-fraction-quantity__annotated-unit")?.getBoundingClientRect().width || 0,
      interactiveSelectWidth: interactiveModel?.querySelector(".pacogo-fraction-quantity__select")?.getBoundingClientRect().width || 0,
      interactiveBarWidth: interactiveModel?.querySelector(".pacogo-fraction-quantity__model")?.getBoundingClientRect().width || 0,
      targetBarWidth: 116,
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
  }, { exerciseValue: exercise, seedStandardScrollValue: seedStandardScroll });
}

test("real Skills route mounts the central fraction template and the approved ten-task bank", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const result = await mountSkillsRoute(page);
  console.log("FRACTION_SUBTRACTION_DESKTOP_LAYOUT", JSON.stringify(result));
  expect(result.title).toBe("Oefenen");
  expect(result.centralPage).toBe(true);
  expect(result.layoutMode).toBe("practice");
  expect(result.practiceBodyClass).toBe(true);
  expect(result.heroDisplay).toBe("none");
  expect(result.sidebarCardDisplay).toBe("flex");
  expect(result.backButtonVisible).toBe(true);
  expect(result.pageHeaderHeight).toBeLessThanOrEqual(60);
  expect(result.scrollY).toBe(0);
  expect(result.standardScrollSaved).toBe("480");
  expect(result.pageMainTop).toBeLessThan(100);
  expect(result.cardBottom).toBeLessThanOrEqual(result.viewportHeight);
  expect(result.documentHeight).toBeLessThanOrEqual(result.viewportHeight + 2);
  expect(result.fractionTemplateCount).toBe(1);
  expect(result.taskCount).toBe(10);
  expect(result.taskIds).toHaveLength(10);
  expect(new Set(result.taskIds).size).toBe(10);
  expect(result.taskRepresentations).toEqual(["bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie", "bar", "pie"]);
  expect(result.firstTaskProgress).toContain("Som 1 van 10");
  expect(result.symbolicExpression).toContain("2");
  expect(result.duplicateVisualExpression).toBe(false);
  expect(result.interactiveRepresentation).toBe("bar");
  expect(result.annotationCount).toBe(2);
  expect(result.interactiveUnitCount).toBe(2);
  expect(result.interactiveUnitWidth).toBe(116);
  expect(result.interactiveBarWidth).toBe(116);
  expect(result.documentWidth).toBeLessThanOrEqual(result.viewportWidth);
});

test("real visual subtraction route fits the mobile viewport in central practice mode", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const result = await mountSkillsRoute(page);
  console.log("FRACTION_SUBTRACTION_MOBILE_LAYOUT", JSON.stringify(result));
  expect(result.title).toBe("Oefenen");
  expect(result.centralPage).toBe(true);
  expect(result.layoutMode).toBe("practice");
  expect(result.heroDisplay).toBe("none");
  expect(result.sidebarCardDisplay).toBe("flex");
  expect(result.backButtonVisible).toBe(true);
  expect(result.pageHeaderHeight).toBeLessThanOrEqual(52);
  expect(result.scrollY).toBe(0);
  expect(result.standardScrollSaved).toBe("480");
  expect(result.pageMainTop).toBeLessThan(100);
  expect(result.cardBottom).toBeLessThanOrEqual(result.viewportHeight);
  expect(result.documentHeight).toBeLessThanOrEqual(result.viewportHeight + 2);
  expect(result.fractionTemplateCount).toBe(1);
  expect(result.duplicateVisualExpression).toBe(false);
  expect(result.interactiveRepresentation).toBe("bar");
  expect(result.annotationCount).toBe(2);
  expect(result.interactiveUnitCount).toBe(2);
  expect(result.documentWidth).toBeLessThanOrEqual(result.viewportWidth);
  expect(result.interactiveUnitWidth).toBe(116);
  expect(result.interactiveBarWidth).toBe(116);
  expect(result.cardWidth).toBeGreaterThan(0);
  expect(result.cardWidth).toBeLessThanOrEqual(result.viewportWidth);
});


test("Skills overview keeps the standard page-template layout", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const result = await mountSkillsRoute(page, { exercise: null, seedStandardScroll: false });
  expect(result.layoutMode).toBe("standard");
  expect(result.practiceBodyClass).toBe(false);
  expect(result.heroDisplay).not.toBe("none");
  expect(result.sidebarCardDisplay).not.toBe("none");
  expect(result.backButtonVisible).toBe(true);
});


test("learner constructs 1 1/3 subtraction in the single interactive visual workspace", async ({ page }) => {
  await mountPractice(page, "bar", { whole: 1, numerator: 1, denominator: 3 });
  const equation = page.getByLabel("Aftreksom", { exact: true });
  const workspace = page.locator(".fraction-quantity-subtraction-model .pacogo-fraction-quantity");
  const units = workspace.locator(".pacogo-fraction-quantity__annotated-unit");

  await expect(equation).toBeVisible();
  await expect(equation).toContainText("2");
  await expect(page.locator(".fraction-quantity-subtraction-expression--visual")).toHaveCount(0);
  await expect(workspace).toHaveAttribute("data-representation", "bar");
  await expect(units).toHaveCount(2);
  await expect(workspace.locator(".pacogo-fraction-quantity__annotation")).toHaveCount(2);
  await expect(workspace.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 2");
  await expect(workspace.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 0");

  const firstBar = units.nth(0).locator(".pacogo-fraction-quantity__segment");
  await firstBar.click();
  await expect(workspace.locator(".pacogo-fraction-quantity__amount")).toContainText("Over: 1");
  await expect(workspace.locator(".pacogo-fraction-quantity__amount")).toContainText("Afgetrokken: 1");
  await expect(units.nth(0).locator(".pacogo-fraction-quantity__annotation")).toHaveAttribute("aria-label", "0 hele eenheden");

  await units.nth(1).getByRole("button", { name: "Verdelen van eenheid 2" }).click();
  await page.getByRole("button", { name: "3 delen" }).click();
  await expect(units.nth(1).locator(".pacogo-fraction-quantity__annotation")).toHaveAttribute("aria-label", "3 van 3 delen gevuld");
  await expect(units).toHaveCount(2);

  await units.nth(1).locator('.pacogo-fraction-quantity__segment[data-segment-index="0"]').click();
  await expect(units.nth(1).locator(".pacogo-fraction-quantity__annotation")).toHaveAttribute("aria-label", "2 van 3 delen gevuld");
  await expect(workspace.locator(".pacogo-fraction-quantity__amount")).toContainText("Over:");
  await expect(workspace.locator('[aria-label="Overgebleven hoeveelheid: 2 gedeeld door 3"]')).toBeVisible();
  await expect(workspace.locator('[aria-label="Afgetrokken hoeveelheid: 1 hele en 1 gedeeld door 3"]')).toBeVisible();
});
