import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { Map, Ship } from "lucide-react";

import {
  LUCIDE_EVENT_ICONS,
  LUCIDE_FILTER_ICONS,
} from "../src/lucide-icon-map.js";
import {
  PUBLIC_EVENT_SUB_FILTER_ICONS,
} from "../src/event-schema.js";
import {
  resolvePublicEventIcon,
} from "../src/event-icon.js";

test("colonialism uses map, ship transport remains", () => {
  assert.equal(LUCIDE_EVENT_ICONS.colonialism, Map);
  assert.equal(LUCIDE_FILTER_ICONS.map, Map);
  assert.equal(LUCIDE_EVENT_ICONS["transport-ship"], Ship);

  assert.deepEqual(
    PUBLIC_EVENT_SUB_FILTER_ICONS.economy,
    ["chart-no-axes-column-increasing", "map"]
  );
});

test("Codd relational model is computer history, not economy", () => {
  const lines = fs.readFileSync(
    new URL("../public/events.tsv", import.meta.url),
    "utf8"
  ).trimEnd().split("\n");

  const header = lines.shift().split("\t");
  const events = lines.map(line => {
    const cells = line.split("\t");
    assert.equal(cells.length, header.length);
    return Object.fromEntries(
      header.map((key, i) => [key, cells[i]])
    );
  });

  const matches = events.filter(
    event => event.id === "1970-codd-relational-model"
  );

  assert.equal(matches.length, 1);

  const event = matches[0];

  assert.equal(event.primary, "computer");
  assert.equal(event.subs, "");
  assert.equal(
    resolvePublicEventIcon(event),
    "fallback-computer"
  );
});
