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

  const state = await page.evaluate(() => ({
    calls: window.__pacoPracticeTest.calls,
    local: Object.entries(localStorage).filter(([key]) => key.startsWith("pacogo:fraction-practice:"))
  }));
  expect(state.calls.filter(call => call[0] === "rpc")).toEqual([]);
  expect(state.calls).toEqual([["select", "learner_profiles"]]);
  expect(state.local).toHaveLength(1);
  expect(state.local[0][0]).toContain(learnerKey);
  expect(state.local[0][1]).not.toContain("explanation");
  expect(state.local[0][1]).not.toContain("response");
  expect(pageErrors).toEqual([]);
});
