import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const sourceTable = JSON.parse(
  readFileSync(
    new URL("../src/data/source-table.json", import.meta.url),
    "utf8",
  ),
) as { actors: string; strategy: string }[];

const audienceLabels = [
  ["Researchers", "Researchers"],
  ["Research users & practitioners", "Research users/practitioners"],
  ["Research communities & networks", "Research community/networks"],
  [
    "Universities & research institutions",
    "Universities/research institutions",
  ],
  ["Research funders", "Research funders"],
  ["National & local government", "National/local governments"],
  ["International organisations", "International organisations"],
  ["Industry partners", "Industry partners"],
  ["Research user organisations", "Research user organisations"],
  ["Publishers", "Publishers"],
];

test("loads a meaningful screen with no runtime or asset errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle("Research into action | Behavioural research");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What can you do to enhance behavioural research capability?",
  );
  await expect(
    page.getByRole("heading", {
      name: "Create accessible communication resources",
    }),
  ).toBeVisible();
  await expect(page.locator("vite-error-overlay")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("all ten audience maps agree with the original published Table 3", async ({
  page,
}) => {
  await page.goto("/");
  for (const [label, source] of audienceLabels) {
    await page.getByRole("button", { name: label, exact: true }).click();
    const expected = sourceTable.flatMap((row, index) =>
      row.actors.split(";").includes(source)
        ? [String(index + 1).padStart(2, "0")]
        : [],
    );
    await expect(
      page.locator(".network-node.is-relevant .node-number"),
    ).toHaveText(expected);
    await expect(page.locator(".centre-count")).toHaveText(
      `${expected.length} relevant strategies`,
    );
    await expect(page.locator(".strategy-index")).toHaveText(
      `Strategy ${expected[0]}`,
    );
  }
});

test("all ten strategy panels reproduce Table 3 titles and actions verbatim", async ({
  page,
}) => {
  await page.goto("/");
  for (let index = 0; index < sourceTable.length; index++) {
    await page
      .getByRole("button", { name: new RegExp(`^Strategy ${index + 1}:`) })
      .click();
    const [numberedTitle, ...actions] = sourceTable[index].strategy.split("•");
    expect(await page.locator("#strategy-title").textContent()).toBe(
      numberedTitle.replace(/^\d+\.\s*/, "").trim(),
    );
    expect(await page.locator(".action-list li").allTextContents()).toEqual(
      actions.map((action) => action.trim()),
    );
    await expect(
      page.locator(".strategy-summary, .detail-copy h4"),
    ).toHaveCount(0);
    await expect(page.locator(".source-link")).toHaveAttribute(
      "href",
      /#pone-0357909-t003$/,
    );
    await expect(page.locator(".strategy-index")).toHaveText(
      `Strategy ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("all ten saved, copied and downloaded strategies preserve the exact Table 3 wording", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?plan=1,2,3,4,5,6,7,8,9,10");
  await page.getByRole("button", { name: "View your plan" }).click();
  const saved = page.locator(".saved-strategies > li");
  await expect(saved).toHaveCount(10);
  for (let index = 0; index < sourceTable.length; index++) {
    const [numberedTitle, ...actions] = sourceTable[index].strategy.split("•");
    expect(await saved.nth(index).locator("h3").textContent()).toBe(
      numberedTitle.replace(/^\d+\.\s*/, "").trim(),
    );
    expect(await saved.nth(index).locator("ul li").allTextContents()).toEqual(
      actions.map((action) => action.trim()),
    );
  }
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download plan" }).click();
  const download = await downloadEvent;
  const downloadedText = await readFile((await download.path())!, "utf8");
  for (const row of sourceTable) {
    const [numberedTitle, ...actions] = row.strategy.split("•");
    expect(downloadedText).toContain(
      [
        numberedTitle.trim(),
        ...actions.map((action) => `  [ ] ${action.trim()}`),
      ].join("\n"),
    );
  }
  await page.getByRole("button", { name: "Copy plan", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    downloadedText,
  );
});

test("keyboard, list alternative and history update the selected strategy", async ({
  page,
}) => {
  await page.goto("/");
  const node = page.getByRole("button", { name: /^Strategy 9:/ });
  await node.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Shift to systems-level approaches" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "View as a list" }).click();
  await expect(page.locator(".strategy-list-row")).toHaveCount(10);
  await page.getByRole("button", { name: /05 Rethink funding/ }).click();
  await expect(page.locator(".other-role-note")).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Shift to systems-level approaches" }),
  ).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole("heading", {
      name: "Reform funding structures",
    }),
  ).toBeVisible();
});

test("saved strategies persist, export with attribution and reopen through a shared link", async ({
  page,
  context,
  browser,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Save this strategy" }).click();
  await page
    .getByRole("button", { name: "Research funders", exact: true })
    .click();
  await page.getByRole("button", { name: "Save this strategy" }).click();
  await page.reload();
  await expect(page.getByText("2 strategies saved")).toBeVisible();
  await page.getByRole("button", { name: "View your plan" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download plan" }).click();
  const download = await downloadEvent;
  const text = await readFile((await download.path())!, "utf8");
  expect(text).toContain("Create accessible communication resources");
  expect(text).toContain("Reform funding structures");
  expect(text).toContain("10.1371/journal.pone.0357909");
  expect(text).toContain("not ranked or tested interventions");
  await page.getByRole("button", { name: "Copy plan", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "MY NEXT STEPS",
  );
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  const share = await page.evaluate(() => navigator.clipboard.readText());
  expect(share).toContain("role=funders");
  expect(share).toContain("plan=1%2C5");
  const freshContext = await browser.newContext();
  const fresh = await freshContext.newPage();
  await fresh.goto(share);
  await expect(fresh.getByText("2 strategies saved")).toBeVisible();
  await expect(
    fresh.getByRole("heading", {
      name: "Reform funding structures",
    }),
  ).toBeVisible();
  await fresh.getByRole("button", { name: "View your plan" }).click();
  await fresh
    .getByRole("button", { name: "Remove strategy 1 from your plan" })
    .click();
  await fresh.reload();
  await expect(fresh.getByText("1 strategy saved")).toBeVisible();
  await freshContext.close();
});

test("bad URL parameters and blocked local storage leave a usable explorer", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => "{broken json";
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
  });
  await page.goto("/?role=invalid&strategy=999&plan=0,1,1,99,bad");
  await expect(
    page.getByRole("heading", {
      name: "Create accessible communication resources",
    }),
  ).toBeVisible();
  await expect(page.getByText("1 strategy saved")).toBeVisible();
  await page.getByRole("button", { name: "View your plan" }).click();
  await expect(
    page.getByText("Browser storage is unavailable.", { exact: false }),
  ).toBeVisible();
});

test("mobile role selection and diagram selection reveal readable actions without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("combobox", { name: /Choose your role/ })
    .selectOption("government");
  await expect(page.locator(".centre-count")).toHaveText(
    "3 relevant strategies",
  );
  await page.getByRole("button", { name: /^Strategy 7:/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Strengthen stakeholder and public engagement",
    }),
  ).toBeInViewport();
  // The original repository/resource phrasing must wrap without changing its text.
  await page.goto("/?strategy=2");
  for (const width of [320, 390, 768, 1024, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `Horizontal overflow at ${width}px`).toBe(false);
    const titleOverflow = await page
      .locator("#strategy-title")
      .evaluate((element) => element.scrollWidth > element.clientWidth);
    expect(titleOverflow, `Source title overflow at ${width}px`).toBe(false);
  }
});

test("desktop, mobile and source dialog have no automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "About the study" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "About the study" }),
  ).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
