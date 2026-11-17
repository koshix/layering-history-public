import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  PUBLIC_EVENT_ICON_NAMES,
  THOUGHT_RIGHTS_EVENT_ICON_OVERRIDES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readTsv(path) {
  const lines = fs.readFileSync(
    new URL(path, import.meta.url), "utf8"
  ).trimEnd().split("\n");

  const header = lines.shift().split("\t");

  return lines.map((line) => {
    const values = line.split("\t");
    assert.equal(values.length, header.length);
    return Object.fromEntries(
      header.map((key, i) => [key, values[i]])
    );
  });
}

test("thought and rights audit: 28 events", () => {
  const audit = readTsv(
    "../docs/audits/layering-history-thought-rights-review-20261115.tsv"
  );
  const rows = readTsv("../public/events.tsv");
  const events = new Map(
    rows.map(e => [e.id, e])
  );

  assert.equal(events.size, rows.length);
  assert.equal(audit.length, 28);
  assert.equal(new Set(audit.map(r => r.id)).size, 28);
  assert.equal(
    audit.filter(r => r.decision === "proposed").length, 25
  );
  assert.equal(
    audit.filter(r => r.decision === "retain").length, 3
  );
  assert.equal(
    audit.filter(r => r.subs_before !== r.subs_after).length, 5
  );
  assert.equal(
    audit.filter(r => r.icon_before !== r.icon_after).length, 25
  );

  const automaticIds = new Set([
    "1934-kelsen-hart-legal-theory",
    "1959-woods-hole-curriculum-conference",
    "1961-hart-concept-of-law",
    "2002-1j2d8hz",
  ]);

  const expectedOverrides = Object.fromEntries(
    audit
      .filter(r => r.icon_before !== r.icon_after)
      .filter(r => !automaticIds.has(r.id))
      .map(r => [r.id, r.icon_after])
  );

  assert.equal(Object.keys(expectedOverrides).length, 21);
  assert.deepEqual(
    THOUGHT_RIGHTS_EVENT_ICON_OVERRIDES,
    Object.freeze(expectedOverrides)
  );

  for (const row of audit) {
    const event = events.get(row.id);
    assert.ok(event, row.id);

    for (const field of [
      "date", "title", "primary", "cats", "importance"
    ]) {
      assert.equal(event[field], row[field], `${row.id}: ${field}`);
    }

    assert.equal(event.subs, row.subs_after, row.id);

    const icon = resolvePublicEventIcon(event);
    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(icon), row.id);
    assert.equal(icon, row.icon_after, row.id);
  }
});
