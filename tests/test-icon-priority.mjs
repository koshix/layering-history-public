import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import {
  SUB_ICON_PRIORITY,
  PUBLIC_EVENT_ICON_NAMES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

test("representative icon priority remains fixed", () => {
  assert.deepEqual(SUB_ICON_PRIORITY, [
    "sport",
    "game",
    "food",
    "energy",
    "revolution",
    "architecture",
    "religion",
    "transport",
    "labor",
    "design",
    "stage",
    "gender",
    "communication",
    "colonialism",
    "life",
    "environment",
    "industry",
    "media",
    "technology",
    "space",
    "war",
    "math",
    "visual",
    "biomed",
    "economy",
    "law",
    "music",
    "matter",
    "art",
    "rights",
    "thought",
    "literature",
    "politics",
  ]);
});

test("game uses its own representative icon", () => {
  assert.equal(PUBLIC_EVENT_ICON_NAMES.has("game"), true);

  for (const subs of [
    ["game"],
    ["visual", "game"],
    ["industry", "game"],
    ["technology", "game"],
  ]) {
    assert.equal(
      resolvePublicEventIcon({
        primary: "computer",
        subs,
      }),
      "game"
    );
  }
});

test("architecture covers buildings and urban planning", () => {
  assert.equal(
    PUBLIC_EVENT_ICON_NAMES.has("architecture"),
    true
  );

  const text = readFileSync(
    new URL("../public/events.tsv", import.meta.url),
    "utf8"
  );

  const [headerLine, ...lines] = text
    .trimEnd()
    .split(/\r?\n/);

  const header = headerLine.replace(/^\uFEFF/, "").split("\t");
  const idIndex = header.indexOf("id");
  const subsIndex = header.indexOf("subs");
  const primaryIndex = header.indexOf("primary");

  let count = 0;
  const ids = new Set();

  for (const line of lines) {
    const cells = line.split("\t");
    const subs = cells[subsIndex].split("|").filter(Boolean);

    if (!subs.includes("architecture")) continue;

    count++;
    ids.add(cells[idIndex]);

    const expectedIcon = [
      "1909-first-kokugikan",
      "1964-1h9anrc",
    ].includes(cells[idIndex])
      ? "sport"
      : "architecture";

    assert.equal(
      resolvePublicEventIcon({
        id: cells[idIndex],
        primary: cells[primaryIndex],
        subs,
      }),
      expectedIcon,
      cells[idIndex]
    );
  }

  assert.ok(count >= 16);
  assert.ok(ids.has("1898-howard-garden-city"));
  assert.ok(ids.has("1961-jane-jacobs-cities"));
  assert.ok(ids.has("1615-katsura-villa"));
});

test("religion icon priority covers 24 of 32 events", () => {
  assert.equal(PUBLIC_EVENT_ICON_NAMES.has("religion"), true);
  assert.equal(SUB_ICON_PRIORITY.length, 33);

  const text = readFileSync(
    new URL("../public/events.tsv", import.meta.url),
    "utf8"
  );

  const [headerLine, ...lines] = text.trimEnd().split(/\r?\n/);
  const header = headerLine.replace(/^\uFEFF/, "").split("\t");

  const idIndex = header.indexOf("id");
  const subsIndex = header.indexOf("subs");
  const primaryIndex = header.indexOf("primary");

  const counts = new Map();
  let total = 0;

  for (const line of lines) {
    const cells = line.split("\t");
    const subs = cells[subsIndex].split("|").filter(Boolean);

    if (!subs.includes("religion")) continue;
    total++;

    const icon = resolvePublicEventIcon({
      id: cells[idIndex],
      primary: cells[primaryIndex],
      subs,
    });

    counts.set(icon, (counts.get(icon) ?? 0) + 1);
  }

  assert.equal(total, 32);
  assert.equal(counts.get("religion"), 24);
  assert.equal(counts.get("architecture"), 5);
  assert.equal(counts.get("revolution"), 1);
  // 1508年のシスティーナ礼拝堂天井画は美術を代表表示
  assert.equal(counts.get("art"), 1);
  // インド独立・印パ分離は最新監査で世界政治表示へ変更。
  assert.equal(counts.get("politics-world"), 1);
  assert.equal(counts.size, 5);

  assert.equal(
    resolvePublicEventIcon({
      primary: "society",
      subs: ["religion"],
    }),
    "religion"
  );
});

test("refrozen priority covers all 33 official subs", async () => {
  const { PUBLIC_EVENT_SUB_TAG_KEYS } =
    await import("../src/event-schema.js");

  assert.equal(SUB_ICON_PRIORITY.length, 33);
  assert.equal(new Set(SUB_ICON_PRIORITY).size, 33);

  assert.deepEqual(
    [...SUB_ICON_PRIORITY].sort(),
    [...PUBLIC_EVENT_SUB_TAG_KEYS].sort()
  );

  assert.equal(SUB_ICON_PRIORITY[0], "sport");
  assert.ok(
    SUB_ICON_PRIORITY.indexOf("transport")
    < SUB_ICON_PRIORITY.indexOf("technology")
  );
});
