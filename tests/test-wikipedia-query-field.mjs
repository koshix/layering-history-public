import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  EVENT_TSV_HEADER,
  PUBLIC_EVENT_TSV_HEADER,
  PERSONAL_EVENT_TSV_HEADER,
  EVENT_FIELD_ORDER,
} from "../src/event-schema.js";

import {
  decodeEventRow,
  encodeEventRow,
} from "../src/event-codec.js";

import {
  parsePublicEventsTsv,
} from "../src/public-events-tsv.js";

import {
  parsePersonalEventsTsv,
  serializePersonalEventsTsv,
} from "../src/personal-events-tsv.js";

assert.equal(EVENT_TSV_HEADER.length, 13);
assert.equal(PUBLIC_EVENT_TSV_HEADER.length, 14);
assert.equal(PERSONAL_EVENT_TSV_HEADER.length, 13);

assert.equal(
  PUBLIC_EVENT_TSV_HEADER.at(-1),
  "wiki_query"
);

assert.ok(EVENT_FIELD_ORDER.includes("wiki_query"));

const events = parsePublicEventsTsv(
  readFileSync("public/events.tsv", "utf8")
);

assert.ok(events.length > 0);

for (const item of events) {
  if (item.wiki_query === undefined) continue;

  assert.equal(typeof item.wiki_query, "string");
  assert.ok(item.wiki_query.trim());
  assert.equal(
    item.wiki_query.split('"').length % 2,
    1,
    item.id
  );
  assert.ok(!item.wiki_query.includes("||"), item.id);
}

assert.ok(events.some(
  event => event.wiki_query?.includes(" OR ")
));

const event = events.find(
  e => e.id === "1889-nernst-electrochemistry"
);

assert.ok(event);

assert.equal(
  decodeEventRow(encodeEventRow(event)).wiki_query,
  event.wiki_query
);

const personal = {
  id: "synthetic-wiki-query-test",
  date: "2000",
  title: "個人史互換性試験",
  cats: ["me"],
  primary: "me",
  importance: 2,
  summary: "合成テストデータ",
  wiki_query: "非個人史の検索語",
};

const serialized =
  serializePersonalEventsTsv([personal]);

const lines = serialized.trimEnd().split("\n");

assert.equal(lines[0].split("\t").length, 13);

const restored =
  parsePersonalEventsTsv(serialized);

assert.equal(restored.length, 1);

assert.equal(
  Object.hasOwn(restored[0], "wiki_query"),
  false
);

console.log("OK: 公開14列・個人史13列");
console.log("OK: wiki_query の基本構文");
console.log("OK: 公開codec往復と個人史互換性");

const { applyEventCustomizations } =
  await import("../src/event-customizations.js");

function customized(changes) {
  return applyEventCustomizations([event], {
    overrides: { [event.id]: changes },
  }).events[0];
}

assert.equal(
  customized({ summary: "新しい説明" }).wiki_query,
  event.wiki_query
);

assert.equal(
  customized({ title: event.title }).wiki_query,
  event.wiki_query
);

assert.equal(
  Object.hasOwn(
    customized({ title: "変更したタイトル" }),
    "wiki_query"
  ),
  false
);

assert.equal(
  customized({
    title: "変更したタイトル",
    wiki_query: "新しい検索語",
  }).wiki_query,
  "新しい検索語"
);

assert.equal(
  customized({}).wiki_query,
  event.wiki_query
);

console.log("OK: タイトル変更・復元時の検索語互換性");

const {
  parseEventCustomizationsTsv,
  serializeEventCustomizationsTsv,
} = await import("../src/event-customizations-tsv.js");

const customizations = {
  overrides: {
    [event.id]: {
      title: "変更したタイトル",
      wiki_query: '人物名 OR "作品名"',
    },
  },
  hidden: [],
  additions: [
    {
      id: "synthetic-public-wiki",
      date: "2000",
      title: "追加項目",
      cats: ["science"],
      primary: "science",
      importance: 2,
      summary: "合成テストデータ",
      wiki_query: "科学 OR 技術",
    },
  ],
};

assert.deepEqual(
  parseEventCustomizationsTsv(
    serializeEventCustomizationsTsv(customizations)
  ),
  customizations
);

console.log("OK: カスタマイズTSVの検索語往復");
