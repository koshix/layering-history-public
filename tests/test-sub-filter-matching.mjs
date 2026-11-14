import assert from "node:assert/strict";
import test from "node:test";

import {
  createTimelineSearch,
  selectPublicTimelineEvents,
} from "../src/timeline-model.js";

const tags = [
  ["design-only", ["design"]],
  ["architecture-only", ["architecture"]],
  ["design-and-architecture", ["design", "architecture"]],
  ["visual-only", ["visual"]],
  ["game-only", ["game"]],
  ["visual-and-game", ["visual", "game"]],
  ["unrelated", ["thought"]],
];

const events = tags.map(([id, subs]) => ({
  id,
  date: "2000",
  title: id,
  cats: ["work"],
  primary: "work",
  subs,
  importance: 2,
}));

function select(subFilters) {
  return selectPublicTimelineEvents({
    events,
    catOff: {},
    sfOnly: false,
    subFilters,
    importanceMin: 1,
    search: createTimelineSearch(""),
  }).map((event) => event.id);
}

test("design filter includes architecture", () => {
  assert.deepEqual(select(["design"]), [
    "design-only",
    "architecture-only",
    "design-and-architecture",
  ]);
});

test("visual filter includes game", () => {
  assert.deepEqual(select(["visual"]), [
    "visual-only",
    "game-only",
    "visual-and-game",
  ]);
});

test("multiple filters use OR without duplicates", () => {
  assert.deepEqual(select(["design", "visual"]), [
    "design-only",
    "architecture-only",
    "design-and-architecture",
    "visual-only",
    "game-only",
    "visual-and-game",
  ]);
});

test("unrelated filter excludes all sample events", () => {
  assert.deepEqual(select(["music"]), []);
});

test("no sub filter preserves all sample events", () => {
  assert.deepEqual(
    select([]),
    events.map((event) => event.id)
  );
});

test("integrated sub-filter OR matching", () => {
  const groups = {
    unrest: ["war", "revolution"],
    lifestyle: ["life", "food", "sport"],
    industry: ["industry", "energy", "transport"],
    design: ["design", "architecture"],
    visual: ["visual", "game"],
    thought: ["thought", "religion"],
    rights: ["rights", "labor", "gender"],
    economy: ["economy", "colonialism"],
  };

  const allTags = [...new Set(Object.values(groups).flat())];

  const samples = allTags.map(tag => ({
    id: tag,
    date: "2000",
    title: tag,
    cats: ["society"],
    primary: "society",
    subs: [tag],
    importance: 2,
  }));

  const matches = key =>
    selectPublicTimelineEvents({
      events: samples,
      catOff: {},
      sfOnly: false,
      subFilters: [key],
      importanceMin: 1,
      search: createTimelineSearch(""),
    }).map(event => event.id).sort();

  for (const [key, expected] of Object.entries(groups)) {
    assert.deepEqual(matches(key), [...expected].sort(), key);
  }

  assert.deepEqual(
    matches("lifestyle"),
    ["food", "life", "sport"]
  );

  assert.deepEqual(
    matches("visual"),
    ["game", "visual"]
  );

  assert.equal(matches("lifestyle").includes("game"), false);
});
