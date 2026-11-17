import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  MUSIC_EVENT_ICON_OVERRIDES,
  L1_EVENT_ICON_OVERRIDES,
  L2_CULTURE_EVENT_ICON_OVERRIDES,
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
    const cells = line.split("\t");

    assert.equal(cells.length, header.length);

    return Object.fromEntries(
      header.map((key, i) => [key, cells[i]])
    );
  });
}

test("music audit: 15 events", () => {
  const events = readTsv("../public/events.tsv");

  const audit = readTsv(
    "../docs/audits/layering-history-music-review-20261115.tsv"
  );

  const byId = new Map(
    events.map(event => [event.id, event])
  );

  assert.equal(byId.size, events.length);
  assert.equal(audit.length, 15);
  assert.equal(new Set(audit.map(r => r.id)).size, 15);

  assert.equal(
    audit.filter(r => r.decision === "applied").length,
    12
  );

  assert.equal(
    audit.filter(r => r.decision === "retained").length,
    3
  );

  assert.equal(
    audit.filter(r => r.subs_before !== r.subs_after).length,
    9
  );

  assert.equal(
    audit.filter(r => r.icon_before !== r.icon_after).length,
    12
  );

  const explicitIds = new Set([
    "1956-illiac-music-i",
    "1964-moog-synthesizer",
    "1980-roland-tr808",
    "2008-spotify-launch",
  ]);

  const expectedOverrides = Object.fromEntries(
    audit
      .filter(r => explicitIds.has(r.id))
      .map(r => [r.id, r.icon_after])
  );

  assert.equal(Object.keys(expectedOverrides).length, 4);

  assert.deepEqual(
    MUSIC_EVENT_ICON_OVERRIDES,
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

  // 過去の監査判断は変更せず、表示のみ更新する。
  assert.equal(
    L1_EVENT_ICON_OVERRIDES["1980-roland-tr808"],
    "music"
  );

  assert.equal(
    L2_CULTURE_EVENT_ICON_OVERRIDES[
      "1964-moog-synthesizer"
    ],
    "music"
  );

  assert.equal(
    POLITICS_ECONOMY_EVENT_ICON_OVERRIDES[
      "2008-spotify-launch"
    ],
    "music"
  );

  // 分類上の主分野は変更しない。
  assert.equal(
    byId.get("1956-illiac-music-i").primary,
    "computer"
  );

  assert.equal(
    resolvePublicEventIcon(
      byId.get("1956-illiac-music-i")
    ),
    "fallback-computer"
  );

  // すでに確定した舞台と生活を維持。
  assert.equal(
    resolvePublicEventIcon(
      byId.get("1927-broadway-integrated-musical")
    ),
    "stage"
  );

  assert.equal(
    resolvePublicEventIcon(
      byId.get("1979-sony-walkman")
    ),
    "fallback-culture"
  );

  // 2024年の訴訟の社会・権利分類を保持。
  const ai = byId.get("2024-generative-ai-music-lawsuits");

  assert.equal(ai.cats, "computer|culture|society");
  assert.equal(ai.subs, "music|rights");
  assert.equal(resolvePublicEventIcon(ai), "music");
});
