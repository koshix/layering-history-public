import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  L1_EVENT_ICON_OVERRIDES,
  PUBLIC_EVENT_ICON_NAMES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readTsv(path) {
  const lines = fs.readFileSync(new URL(path, import.meta.url), "utf8")
    .trimEnd().split("\n");
  const header = lines.shift().split("\t");
  return lines.map((line) => Object.fromEntries(
    line.split("\t").map((value, i) => [header[i], value])
  ));
}

test("L1 icon overrides match audited proposals", () => {
  const audit = readTsv("../docs/audits/layering-history-icon-l1-review-20261114.tsv");
  const publicEvents = new Map(readTsv("../public/events.tsv")
    .map((row) => [row.id, row]));
  assert.equal(audit.length, 154);
  const proposed = audit.filter((r) => r.decision === "override_proposed");
  const retained = audit.filter((r) => r.decision === "keep_proposed");
  assert.equal(proposed.length, 101);
  assert.equal(retained.length, 53);
  assert.equal(Object.keys(L1_EVENT_ICON_OVERRIDES).length, 101);
  for (const row of audit) {
    const event = publicEvents.get(row.id);
    assert.ok(event, row.id);
    assert.ok(["1", "L1"].includes(event.importance), row.id);
    const actual = resolvePublicEventIcon(event);
    if (row.decision === "override_proposed") {
      assert.equal(L1_EVENT_ICON_OVERRIDES[row.id], row.suggested_icon, row.id);
      assert.ok(PUBLIC_EVENT_ICON_NAMES.has(actual), row.id);
      assert.equal(actual, row.suggested_icon, row.id);
    } else {
      assert.equal(Object.hasOwn(L1_EVENT_ICON_OVERRIDES, row.id), false, row.id);
    }
  }
});
