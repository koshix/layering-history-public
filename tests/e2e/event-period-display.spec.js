import { test, expect } from "@playwright/test";
import fs from "node:fs";

import {
  parsePublicEventsTsv,
} from "../../src/public-events-tsv.js";

import {
  formatEventPeriod,
  eventDisplayPeriod,
} from "../../src/event-schema.js";

const events = parsePublicEventsTsv(
  fs.readFileSync(
    new URL("../../public/events.tsv", import.meta.url),
    "utf8"
  )
);

const byId = new Map(
  events.map(event => [event.id, event])
);

const crossYear = byId.get("1958-chicken-ramen");
const pointEvent = byId.get("2022-v90lz3");

const sameYear = events.find(event => {
  const period = eventDisplayPeriod(event);
  return period.hasPeriod && !period.spansYears;
});

async function revealEvent(page, event) {
  await page.goto("/");

  const search = page.locator("#timeline-search");

  await expect(search).toBeVisible();

  await page.getByRole("button", {
    name: "全期間枠を開く",
    exact: true,
  }).click();

  await search.fill(event.title);

  const row = page.locator(
    'li[id="ev-' + event.id + '"]'
  );

  await expect(row).toHaveCount(1);
  await expect(row).toBeVisible();

  const button = row.locator(
    ":scope > button[aria-expanded]"
  );

  await expect(button).toBeVisible();

  if (await button.getAttribute("aria-expanded") !== "true") {
    await button.click();
  }

  await expect(button).toHaveAttribute(
    "aria-expanded", "true"
  );

  return row;
}

test("cross-year event displays both endpoint years", async ({
  page,
}) => {
  const row = await revealEvent(page, crossYear);

  await expect(row.locator(
    "[data-event-start-year]"
  )).toHaveText("1958");

  await expect(row.locator(
    "[data-event-end-year]"
  )).toHaveText("1971");

  await expect(row.locator(
    "[data-event-date-detail]"
  )).toHaveText(
    "1958年8月25日〜1971年9月18日"
  );

  await expect(row).toHaveCount(1);
});

test("same-year period preserves full date precision", async ({
  page,
}) => {
  const row = await revealEvent(page, sameYear);

  await expect(row.locator(
    "[data-event-period]"
  )).toHaveText("期間");

  await expect(row.locator(
    "[data-event-end-year]"
  )).toHaveCount(0);

  await expect(row.locator(
    "[data-event-date-detail]"
  )).toHaveText(
    formatEventPeriod(sameYear)
  );
});

test("point event retains a single date", async ({
  page,
}) => {
  const row = await revealEvent(page, pointEvent);

  await expect(row.locator(
    "[data-event-period]"
  )).toHaveCount(0);

  await expect(row.locator(
    "[data-event-date-detail]"
  )).toHaveText(
    formatEventPeriod(pointEvent)
  );
});

test("period display at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  const row = await revealEvent(page, crossYear);

  const start = row.locator(
    "[data-event-start-year]"
  );

  const end = row.locator(
    "[data-event-end-year]"
  );

  await expect(start).toBeVisible();
  await expect(end).toBeVisible();

  const a = await start.boundingBox();
  const b = await end.boundingBox();

  expect(a).not.toBeNull();
  expect(b).not.toBeNull();

  expect(b.y).toBeGreaterThan(a.y);

  const overflow = await page.evaluate(() =>
    globalThis.document.documentElement.scrollWidth >
      globalThis.innerWidth + 1
  );

  expect(overflow).toBe(false);
});

test("single dynamic match displays complete period", async ({
  page,
}) => {
  await page.goto("/?threads=1");

  await page.getByRole("searchbox", {
    name: "たどるキーワード",
  }).fill("1958 チキンラーメン");

  await page.getByRole("button", {
    name: "たどる",
    exact: true,
  }).click();

  await expect(
    page.getByText("1件だけ見つかりました", {
      exact: false,
    })
  ).toBeVisible();

  await expect(
    page.locator("[data-event-date-detail]")
  ).toHaveText(
    formatEventPeriod(crossYear)
  );
});

test("configured thread displays complete period", async ({
  page,
}) => {
  await page.goto("/?threads=1");

  await page.getByRole("button", {
    name: /食べることが巨大なシステムになる/,
  }).click();

  const dialog = page.getByRole("dialog", {
    name: /テーマ閲覧:食べることが巨大なシステムになる/,
  });

  await expect(dialog).toBeVisible();

  const item = dialog.locator("[data-i]").filter({
    hasText: crossYear.title,
  });

  await expect(item).toHaveCount(1);

  await expect(item.locator(
    "[data-event-start-year]"
  )).toHaveText("1958");

  await expect(item.locator(
    "[data-event-end-year]"
  )).toHaveText("1971");

  await item.click();

  await expect(item.locator(
    "[data-event-date-detail]"
  )).toHaveText(
    "期間：" + formatEventPeriod(crossYear)
  );
});
