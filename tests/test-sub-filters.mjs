import assert from "node:assert/strict";
import test from "node:test";

import {
  PUBLIC_EVENT_SUB_FILTER_ICONS,
  PUBLIC_EVENT_SUB_FILTER_ROWS,
  PUBLIC_EVENT_SUB_FILTER_TAGS,
} from "../src/event-schema.js";
import {
  LUCIDE_FILTER_ICONS,
} from "../src/lucide-icon-map.js";

const EXPECTED_ROWS = [
  [
    "thought",
    "rights",
    "law",
    "unrest",
    "politics",
    "economy",
  ],
  [
    "literature",
    "music",
    "stage",
    "art",
    "design",
    "visual",
  ],
  [
    "communication",
    "media",
    "technology",
    "industry",
    "lifestyle",
  ],
  [
    "math",
    "matter",
    "biomed",
    "environment",
    "space",
  ],
];

test("sub filters use 22 options in 6 columns", () => {
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ROWS.map((row) =>
      row.map(([key]) => key)
    ),
    EXPECTED_ROWS
  );
});

test("biomed has the science/health icons and life is not an independent filter", () => {
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.biomed,
    ["dna", "stethoscope"]
  );
  assert.equal(
    Object.hasOwn(PUBLIC_EVENT_SUB_FILTER_ICONS, "life"),
    false
  );
});

test("every sub filter has one to three valid Lucide icons", () => {
  const keys =
    PUBLIC_EVENT_SUB_FILTER_ROWS
      .flat()
      .map(([key]) => key);

  assert.deepEqual(
    [...Object.keys(PUBLIC_EVENT_SUB_FILTER_ICONS)].sort(),
    [...keys].sort()
  );

  for (const key of keys) {
    const icons =
      PUBLIC_EVENT_SUB_FILTER_ICONS[key];

    assert.ok(
      icons.length >= 1 && icons.length <= 3,
      `${key}: icon count must be 1 to 3`
    );

    for (const icon of icons) {
      assert.ok(
        Object.hasOwn(LUCIDE_FILTER_ICONS, icon),
        `${key}: unknown icon ${icon}`
      );
    }
  }
});

test("architecture and game are included in grouped filters", () => {
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_TAGS.design,
    ["design", "architecture"]
  );
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_TAGS.visual,
    ["visual", "game"]
  );

  const keys = PUBLIC_EVENT_SUB_FILTER_ROWS
    .flat()
    .map(([key]) => key);

  assert.equal(keys.includes("architecture"), false);
  assert.equal(keys.includes("game"), false);
});

test("expanded Lucide sub-filter icons", () => {
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.thought,
    ["brain", "sun-moon"]
  );
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.design,
    ["ruler", "building-2"]
  );
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.visual,
    ["clapperboard", "monitor-play", "gamepad-2"]
  );
  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.matter,
    ["atom", "box"]
  );
});

test("integrated filter icon coverage", () => {
  const expected = {
    lifestyle: ["house", "wheat", "dumbbell"],
    industry: ["factory", "zap", "train-front"],
    thought: ["brain", "sun-moon"],
    rights: [
      "person-standing", "hard-hat", "venus-and-mars"
    ],
    economy: [
      "chart-no-axes-column-increasing", "ship"
    ],
    design: ["ruler", "building-2"],
    unrest: ["swords", "flag"],
    visual: ["clapperboard", "monitor-play", "gamepad-2"],
  };

  for (const [key, value] of Object.entries(expected)) {
    assert.deepEqual(
      PUBLIC_EVENT_SUB_FILTER_ICONS[key], value, key
    );
  }

  assert.equal(
    PUBLIC_EVENT_SUB_FILTER_ICONS.lifestyle
      .includes("gamepad-2"),
    false
  );
});
