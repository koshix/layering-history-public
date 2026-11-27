import { test, expect } from "@playwright/test";
import fs from "node:fs";

import {
  parsePublicEventsTsv,
} from "../../src/public-events-tsv.js";

const events = parsePublicEventsTsv(
  fs.readFileSync(
    new URL("../../public/events.tsv", import.meta.url),
    "utf8"
  )
);

const byId = new Map(
  events.map(event => [event.id, event])
);

async function revealEvent(page, event) {
  await page.goto("/");

  const search = page.locator("#timeline-search");

  await expect(search).toBeVisible();

  await page.getByRole("button", {
    name: "全期間枠を開く",
    exact: true,
  }).click();

  const allImportance = page.getByRole("group", {
    name: "重要度による表示",
  }).getByRole("button", {
    name: "全て",
    exact: true,
  });

  await allImportance.click();

  await expect(allImportance).toHaveAttribute(
    "aria-pressed", "true"
  );

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

const cases = [
  ["1008-1m26vb5", "single work"],
  ["1830-1mo2qxz", "artist and artwork"],
  ["1889-nernst-electrochemistry", "scientific terms"],
];

for (const [id, label] of cases) {
  test(`Wikipedia query: ${label}`, async ({ page }) => {
    const event = byId.get(id);

    expect(event).toBeTruthy();
    expect(event.wiki_query).toBeTruthy();

    const row = await revealEvent(page, event);

    const link = row.getByRole("link", {
      name: "Wikipediaで探す",
      exact: true,
    });

    await expect(link).toBeVisible();

    const href = await link.getAttribute("href");
    const url = new URL(href);

    expect(url.origin).toBe("https://ja.wikipedia.org");
    expect(url.pathname).toBe("/w/index.php");

    expect(url.searchParams.get("search"))
      .toBe(event.wiki_query);

    expect(url.searchParams.get("fulltext"))
      .toBe("1");

    await expect(link).toHaveAttribute(
      "target", "_blank"
    );

    if (event.search) {
      const youtube = row.getByRole("link", {
        name: "YouTubeで探す",
        exact: true,
      });

      await expect(youtube).toBeVisible();

      const yt = new URL(
        await youtube.getAttribute("href")
      );

      expect(yt.origin).toBe("https://www.youtube.com");

      expect(yt.searchParams.get("search_query"))
        .toBe(event.search);
    }
  });
}
