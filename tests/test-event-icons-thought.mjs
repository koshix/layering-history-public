import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  PUBLIC_EVENT_ICON_NAMES,
  THOUGHT_EVENT_ICON_OVERRIDES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readTsv(path) {
  const lines = fs.readFileSync(
    new URL(path, import.meta.url),
    "utf8"
  ).trimEnd().split("\n");

  const header = lines.shift().split("\t");

  return lines.map((line) => {
    const values = line.split("\t");
    return Object.fromEntries(
      header.map((key, i) => [key, values[i]])
    );
  });
}

test("thought audit batch 1: 20 events and icons", () => {
  const audit = readTsv(
    "../docs/audits/layering-history-thought-review-01-20-20261115.tsv"
  );

  const events = new Map(
    readTsv("../public/events.tsv")
      .map((event) => [event.id, event])
  );

  assert.equal(audit.length, 20);
  assert.equal(
    audit.filter((r) => r.decision === "approved").length,
    19
  );
  assert.equal(
    audit.filter((r) => r.decision === "retain").length,
    1
  );

  assert.equal(
    audit.filter((r) => r.subs_before !== r.subs_after).length,
    9
  );
  assert.equal(
    audit.filter((r) => r.primary_before !== r.primary_after).length,
    1
  );
  assert.equal(
    audit.filter((r) => r.icon_before !== r.icon_after).length,
    16
  );

  const expectedOverrides = {
    "1508-michelangelo-sistine-ceiling": "art",
    "1657-comenius-didactica-magna": "fallback-education",
    "1662-17ugskf": "fallback-education",
    "1713-1f692r9": "life-health",
    "1748-spirit-of-laws": "law",
    "1762-rousseau-emile": "fallback-education",
    "1792-wollstonecraft-rights-woman": "gender",
    "1890-imperial-rescript-education": "fallback-education",
    "1906-duhem-physical-theory": "fallback-science",
    "1936-piaget-origins-intelligence": "fallback-science",
  };

  assert.deepEqual(
    Object.entries(THOUGHT_EVENT_ICON_OVERRIDES).sort(),
    Object.entries(expectedOverrides).sort()
  );

  for (const row of audit) {
    const event = events.get(row.id);
    assert.ok(event, row.id);

    for (const field of ["cats", "primary", "subs"]) {
      assert.equal(
        event[field],
        row[`${field}_after`],
        `${row.id}: ${field}`
      );
    }

    const actual = resolvePublicEventIcon(event);

    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(actual), row.id);
    assert.equal(actual, row.icon_after, row.id);
  }
});
