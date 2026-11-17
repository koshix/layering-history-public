import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  LITERATURE_EVENT_ICON_OVERRIDES,
  PUBLIC_EVENT_ICON_NAMES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readTsv(path) {
  const lines = fs.readFileSync(
    new URL(path, import.meta.url),
    "utf8"
  ).trimEnd().split("\n");
  const header = lines.shift().split("\t");

  return lines.map(line => {
    const cells = line.split("\t");
    assert.equal(cells.length, header.length);
    return Object.fromEntries(
      header.map((key, i) => [key, cells[i]])
    );
  });
}

test("literature review: 29 events", () => {
  const audit = readTsv(
    "../docs/audits/layering-history-literature-review-20261115.tsv"
  );
  const events = readTsv("../public/events.tsv");
  const byId = new Map(events.map(e => [e.id, e]));

  assert.equal(byId.size, events.length);
  assert.equal(audit.length, 29);
  assert.equal(new Set(audit.map(r => r.id)).size, 29);

  assert.equal(
    audit.filter(r => r.decision === "applied").length, 16
  );
  assert.equal(
    audit.filter(r => r.decision === "retained").length, 13
  );

  assert.equal(
    audit.filter(r => r.subs_before !== r.subs_after).length,
    13
  );
  assert.equal(
    audit.filter(r => r.icon_before !== r.icon_after).length,
    7
  );

  const explicitIds = new Set([
    "1516-more-utopia",
    "1580-montaigne-essays",
    "1934-night-galactic-railroad",
  ]);
  const automaticIds = new Set([
    "1536-calvin-institutes",
    "1798-rakugo-yose",
    "1927-broadway-integrated-musical",
    "1930-entatsu-achako-manzai",
  ]);

  const expectedOverrides = Object.fromEntries(
    audit
      .filter(r => explicitIds.has(r.id))
      .map(r => [r.id, r.icon_after])
  );

  assert.equal(Object.keys(expectedOverrides).length, 3);
  assert.deepEqual(
    LITERATURE_EVENT_ICON_OVERRIDES,
    Object.freeze(expectedOverrides)
  );

  for (const row of audit) {
    const event = byId.get(row.id);
    assert.ok(event, row.id);

    for (const field of [
      "date", "title", "primary", "cats", "importance"
    ]) {
      assert.equal(event[field], row[field], row.id);
    }

    assert.equal(event.subs, row.subs_after, row.id);

    const icon = resolvePublicEventIcon(event);
    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(icon), row.id);
    assert.equal(icon, row.icon_after, row.id);
  }

  assert.equal(
    audit.filter(r =>
      !r.subs_after.split("|").includes("literature")
    ).length,
    13
  );

  assert.equal(
    audit.filter(r =>
      r.subs_after.split("|").includes("literature")
    ).length,
    16
  );

  for (const id of automaticIds) {
    const row = audit.find(r => r.id === id);
    assert.ok(row, id);
    assert.notEqual(row.icon_before, row.icon_after);
    assert.equal(
      Object.hasOwn(LITERATURE_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );
  }

  const calvin = byId.get("1536-calvin-institutes");
  assert.equal(calvin.primary, "work");
  assert.equal(calvin.subs, "thought|religion");
  assert.equal(resolvePublicEventIcon(calvin), "religion");

  const galactic = byId.get(
    "1934-night-galactic-railroad"
  );
  assert.equal(galactic.subs, "literature|space");
  assert.equal(
    resolvePublicEventIcon(galactic),
    "literature-japan"
  );
});
