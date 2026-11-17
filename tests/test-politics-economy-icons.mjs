import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  POLITICS_ECONOMY_EVENT_ICON_OVERRIDES,
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
    const values = line.split("\t");

    assert.equal(values.length, header.length);

    return Object.fromEntries(
      header.map((key, i) => [key, values[i]])
    );
  });
}

test("politics and economy audit: 23 events", () => {
  const events = readTsv("../public/events.tsv");

  const audit = readTsv(
    "../docs/audits/layering-history-politics-economy-icon-review-20261115.tsv"
  );

  const byId = new Map(
    events.map(e => [e.id, e])
  );

  assert.equal(byId.size, events.length);
  assert.equal(audit.length, 23);

  assert.equal(
    new Set(audit.map(r => r.id)).size,
    23
  );

  assert.equal(
    audit.filter(r => r.decision === "applied").length,
    21
  );

  assert.equal(
    audit.filter(r => r.decision === "applied_alternative").length,
    1
  );

  assert.equal(
    audit.filter(r => r.decision === "retained").length,
    1
  );

  const automatic = "1970-codd-relational-model";
  const retained = "1961-berlin-wall-construction";

  const expectedOverrides = Object.fromEntries(
    audit
      .filter(
        r => ![automatic, retained].includes(r.id)
      )
      .map(r => [r.id, r.icon_after])
  );

  assert.equal(
    Object.keys(expectedOverrides).length,
    21
  );

  assert.deepEqual(
    POLITICS_ECONOMY_EVENT_ICON_OVERRIDES,
    Object.freeze(expectedOverrides)
  );

  for (const row of audit) {
    const event = byId.get(row.id);

    assert.ok(event, row.id);

    for (const field of [
      "date", "title", "primary"
    ]) {
      assert.equal(
        event[field],
        row[field],
        row.id
      );
    }

    const latestSubs = row.id === "2008-spotify-launch"
      ? "media|music|economy"
      : row.subs_after;
    assert.equal(event.subs, latestSubs, row.id);

    const icon = resolvePublicEventIcon(event);

    assert.ok(
      PUBLIC_EVENT_ICON_NAMES.has(icon),
      row.id
    );

    const latestIcon = row.id === "2008-spotify-launch"
      ? "media"
      : row.icon_after;
    assert.equal(icon, latestIcon, row.id);
  }

  const codd = byId.get(automatic);

  assert.equal(codd.primary, "computer");
  assert.equal(codd.subs, "");

  assert.equal(
    resolvePublicEventIcon(codd),
    "fallback-computer"
  );

  assert.equal(
    resolvePublicEventIcon(byId.get(retained)),
    "rights-suppress"
  );

  assert.equal(
    resolvePublicEventIcon(
      byId.get("1973-chile-coup-pinochet")
    ),
    "rights-suppress"
  );
});
