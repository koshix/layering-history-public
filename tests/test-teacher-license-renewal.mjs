import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  TEACHER_LICENSE_RENEWAL_EVENT_ICON_OVERRIDES,
  resolvePublicEventIcon,
} from "../src/event-icon.js";
import { THREADS } from "../src/threads.js";

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

test("teacher license renewal: introduction and abolition", () => {
  const events = readTsv("../public/events.tsv");
  const byId = new Map(
    events.map(event => [event.id, event])
  );

  const audit = readTsv(
    "../docs/audits/layering-history-teacher-license-renewal-2009-review-20261115.tsv"
  );

  const startId = "2009-teacher-license-renewal-introduced";
  const endId = "2022-teacher-license-renewal-abolished";

  assert.equal(byId.size, events.length);
  assert.equal(audit.length, 1);

  const start = byId.get(startId);
  const end = byId.get(endId);

  assert.ok(start);
  assert.ok(end);

  for (const field of [
    "id", "date", "end_date", "title",
    "cats", "primary", "subs", "region",
    "importance", "summary", "sources", "search", "note",
  ]) {
    assert.equal(start[field], audit[0][field], field);
  }

  assert.equal(audit[0].status, "applied");
  assert.equal(audit[0].icon_proposed, "fallback-education");

  assert.equal(start.date, "2009-04-01");
  assert.equal(start.primary, "education");
  assert.equal(start.subs, "law");
  assert.equal(start.importance, "2");

  assert.equal(end.date, "2022-07-01");
  assert.equal(end.primary, "education");
  assert.equal(end.importance, "1");

  assert.deepEqual(
    TEACHER_LICENSE_RENEWAL_EVENT_ICON_OVERRIDES,
    Object.freeze({
      [startId]: "fallback-education",
    })
  );

  assert.equal(
    resolvePublicEventIcon(start),
    "fallback-education"
  );
  assert.equal(
    resolvePublicEventIcon(end),
    "fallback-education"
  );

  const thread = THREADS.find(
    item => item.key === "learning-systems"
  );

  assert.ok(thread);

  const ids = thread.items.map(item => item.id);

  assert.equal(ids.filter(id => id === startId).length, 1);
  assert.equal(ids.filter(id => id === endId).length, 1);

  const position = id => ids.indexOf(id);

  assert.ok(position("2008-mooc-formation") < position(startId));
  assert.ok(position(startId) < position("2019-giga-school"));

  assert.ok(
    position("2022-high-school-course-of-study-information1")
    < position(endId)
  );

  assert.ok(
    position(endId)
    < position("2023-generative-ai-school-guideline")
  );
});
