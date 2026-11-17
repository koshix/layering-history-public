import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  PUBLIC_EVENT_ICON_NAMES,
  THOUGHT_BATCH2_ICON_OVERRIDES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readTsv(path) {
  const lines = fs.readFileSync(
    new URL(path, import.meta.url), "utf8"
  ).trimEnd().split("\n");

  const header = lines.shift().split("\t");

  return lines.map((line) => {
    const values = line.split("\t");
    return Object.fromEntries(
      header.map((key, i) => [key, values[i]])
    );
  });
}

test("thought audit batch 2: 21 events and icons", () => {
  const audit = readTsv(
    "../docs/audits/layering-history-thought-review-21-41-20261115.tsv"
  );

  const events = new Map(
    readTsv("../public/events.tsv")
      .map((event) => [event.id, event])
  );

  assert.equal(audit.length, 21);
  assert.equal(
    audit.filter((r) => r.decision === "approved").length, 17
  );
  assert.equal(
    audit.filter((r) => r.decision === "retain").length, 4
  );
  assert.equal(
    audit.filter((r) => r.subs_before !== r.subs_after).length, 8
  );
  assert.equal(
    audit.filter((r) => r.icon_before !== r.icon_after).length, 16
  );

  const expectedOverrides = {
    "1946-17jncbd": "literature-japan",
    "1950-turing-computing-machinery-intelligence": "fallback-computer",
    "1965-lengrand-lifelong-education-working-paper": "fallback-education",
    "1971-illich-deschooling-society": "fallback-education",
    "1980-papert-mindstorms-book": "fallback-computer",
    "1983-gnu-announcement": "fallback-computer",
    "1989-crenshaw-intersection-race-sex": "gender",
    "1933-holocaust": "rights-suppress",
    "1943-colossus-computer": "technology-innovation",
    "1979-three-mile-island": "environment",
  };

  assert.deepEqual(
    Object.entries(THOUGHT_BATCH2_ICON_OVERRIDES).sort(),
    Object.entries(expectedOverrides).sort()
  );

  for (const row of audit) {
    const event = events.get(row.id);
    assert.ok(event, row.id);
    assert.equal(event.primary, row.primary, row.id);
    assert.equal(event.subs, row.subs_after, row.id);

    const actual = resolvePublicEventIcon(event);
    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(actual), row.id);
    assert.equal(actual, row.icon_after, row.id);
  }
});
