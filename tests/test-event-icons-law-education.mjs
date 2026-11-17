import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  LAW_EDUCATION_EVENT_ICON_OVERRIDES,
  L2_EDUCATION_EVENT_ICON_OVERRIDES,
  PUBLIC_EVENT_ICON_NAMES,
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
    assert.equal(values.length, header.length);
    return Object.fromEntries(
      header.map((key, i) => [key, values[i]])
    );
  });
}

test("law to education audit: 13 representative icons", () => {
  const audit = readTsv(
    "../docs/audits/layering-history-law-to-education-icon-review-20261115.tsv"
  );

  const rows = readTsv("../public/events.tsv");
  const events = new Map(
    rows.map((event) => [event.id, event])
  );

  assert.equal(events.size, rows.length);
  assert.equal(audit.length, 13);
  assert.equal(new Set(audit.map(r => r.id)).size, 13);

  const expectedOverrides = Object.fromEntries(
    audit.map(r => [r.id, r.icon_after])
  );

  assert.deepEqual(
    LAW_EDUCATION_EVENT_ICON_OVERRIDES,
    Object.freeze(expectedOverrides)
  );

  for (const row of audit) {
    const event = events.get(row.id);
    assert.ok(event, row.id);

    for (const field of [
      "date", "title", "primary",
      "cats", "subs", "importance"
    ]) {
      assert.equal(
        event[field],
        row[field],
        `${row.id}: ${field}`
      );
    }

    assert.equal(row.decision, "approved");
    assert.equal(row.icon_before, "law");
    assert.equal(row.icon_after, "fallback-education");

    assert.equal(
      resolvePublicEventIcon(event),
      "fallback-education",
      row.id
    );
    assert.ok(
      PUBLIC_EVENT_ICON_NAMES.has(
        resolvePublicEventIcon(event)
      ),
      row.id
    );
  }

  // 過去のL2監査記録を改変しない
  assert.equal(
    L2_EDUCATION_EVENT_ICON_OVERRIDES[
      "2004-national-university-corporations"
    ],
    "law"
  );
});
