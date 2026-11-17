import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  PUBLIC_EVENT_ICON_NAMES,
  L3_EVENT_ICON_OVERRIDES,
  L2_WORK_EVENT_ICON_OVERRIDES,
  L2_SCIENCE_EVENT_ICON_OVERRIDES,
  L2_SOCIETY_EVENT_ICON_OVERRIDES,
  L2_CULTURE_EVENT_ICON_OVERRIDES,
  L2_EDUCATION_EVENT_ICON_OVERRIDES,
  L2_COMPUTER_EVENT_ICON_OVERRIDES,
  TRANSPORT_MODE_ICON_BY_ID,
  resolvePublicEventIcon,
} from "../src/event-icon.js";

function readPublicEvents() {
  const text = fs.readFileSync(
    new URL("../public/events.tsv", import.meta.url),
    "utf8"
  );

  const [headerLine, ...lines] = text
    .trimEnd()
    .split("\n");

  const header = headerLine.split("\t");
  const index = Object.fromEntries(
    header.map((name, i) => [name, i])
  );

  return lines.map((line) => {
    const cells = line.split("\t");

    return {
      id: cells[index.id],
      primary: cells[index.primary],
      subs: cells[index.subs]
        ? cells[index.subs].split("|")
        : [],
      region: cells[index.region] ?? "",
    };
  });
}

test("icons.svg contains exactly public semantic icons plus personal flag", () => {
  const svg = fs.readFileSync(
    new URL("../public/icons.svg", import.meta.url),
    "utf8"
  );

  const names = [
    ...svg.matchAll(
      /<symbol\b[^>]*\bid="icon-([^"]+)"/g
    ),
  ].map((match) => match[1]);

  const lucideOnly = new Set([
    "sport",
    "food",
    "energy",
    "transport",
    "labor",
    "gender",
    "colonialism",
    "transport-plane",
    "transport-car",
    "transport-ship",
  ]);

  const expected = [
    ...[...PUBLIC_EVENT_ICON_NAMES].filter(
      (name) => !lucideOnly.has(name)
    ),
    "flag",
  ].sort();

  assert.equal(names.length, expected.length);
  assert.deepEqual(
    [...names].sort(),
    expected
  );
});

test("all public events resolve to semantic icons", () => {
  const events = readPublicEvents();

  for (const event of events) {
    const icon = resolvePublicEventIcon(event);

    assert.ok(
      PUBLIC_EVENT_ICON_NAMES.has(icon),
      `${event.id}: unknown icon ${icon}`
    );
  }
});

test("sub tag priority is stable", () => {
  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "society",
      subs: ["politics", "war"],
      region: "日本",
    }),
    "war"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "work",
      subs: ["literature", "space"],
      region: "日本",
    }),
    "space"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "society",
      subs: ["politics", "rights", "revolution"],
      region: "世界",
    }),
    "revolution"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "society",
      subs: ["economy", "industry"],
      region: "世界",
    }),
    "industry"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "computer",
      subs: ["technology", "communication"],
      region: "世界",
    }),
    "communication"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "society",
      subs: ["rights", "law"],
      region: "世界",
    }),
    "law"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "society",
      subs: ["environment", "law"],
      region: "世界",
    }),
    "environment"
  );
});

test("split icon rules are stable", () => {
  assert.equal(
    resolvePublicEventIcon({
      id: "2022-1lh89p8",
      primary: "society",
      subs: ["politics"],
      region: "日本",
    }),
    "politics-japan"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "1685-revocation-edict-nantes",
      primary: "society",
      subs: ["rights"],
      region: "フランス・欧州",
    }),
    "rights-suppress"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "1789-declaration-rights-man",
      primary: "society",
      subs: ["rights"],
      region: "フランス・欧州・世界",
    }),
    "rights-expand"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "2004-graphene-isolation",
      primary: "science",
      subs: ["matter"],
      region: "世界",
    }),
    "matter-material"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "2012-8royp8",
      primary: "science",
      subs: ["matter"],
      region: "世界",
    }),
    "matter-physics"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "2020-13ara66",
      primary: "society",
      subs: ["biomed"],
      region: "世界",
    }),
    "life-health"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "1953-dna-double-helix",
      primary: "science",
      subs: ["biomed"],
      region: "世界",
    }),
    "life-science"
  );
});

test("matter physics/chemistry classification", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const cases = [
    ["1799-proust-definite-proportions", "matter-material"],
    ["1911-onnes-superconductivity", "matter-physics"],
    ["1904-fleming-valve", "matter-physics"],
    ["1947-transistor", "matter-material"],
    ["1986-high-tc-superconductivity", "matter-material"],
    ["1989-1993-blue-led-gan", "technology-innovation"],
    ["2004-graphene-isolation", "matter-material"],
  ];

  for (const [id, expected] of cases) {
    assert.ok(events.has(id), `missing event: ${id}`);
    assert.equal(
      resolvePublicEventIcon(events.get(id)),
      expected,
      id
    );
  }
});

test("empty subs falls back to primary", () => {
  assert.equal(
    resolvePublicEventIcon({
      id: "x",
      primary: "computer",
      subs: [],
      region: "世界",
    }),
    "fallback-computer"
  );
});

test("transport mode exceptions by event ID", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const exceptions = Object.entries(TRANSPORT_MODE_ICON_BY_ID);
  assert.equal(exceptions.length, 12);

  for (const [id, icon] of exceptions) {
    assert.ok(events.has(id), id);
    assert.ok(events.get(id).subs.includes("transport"), id);
    assert.equal(resolvePublicEventIcon(events.get(id)), icon, id);
  }

  assert.equal(
    resolvePublicEventIcon({
      id: "1830-liverpool-manchester-railway",
      primary: "culture",
      subs: ["industry", "technology", "transport"],
    }),
    "transport"
  );

  assert.equal(
    resolvePublicEventIcon({
      id: "1903-1mfla0p",
      primary: "science",
      subs: ["energy", "transport"],
    }),
    "energy"
  );
});

test("reviewed L3 icon exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1545-potosi-silver", "economy"],
    ["1700-cristofori-piano", "music"],
    ["1839-first-opium-war", "war"],
    ["1867-marx-capital-volume1", "economy"],
    ["1867-lister-antiseptic-surgery", "life-health"],
    ["1928-v3n6qx", "life-health"],
    ["1936-keynes-general-theory", "economy"],
    ["1769-watt-steam-engine-patent", "technology-innovation"],
    ["1857-pasteur-microbes-pasteurization", "life-science"],
  ]);

  assert.deepEqual(
    new Map(Object.entries(L3_EVENT_ICON_OVERRIDES)),
    expected
  );

  for (const [id, icon] of expected) {
    assert.ok(events.has(id), id);
    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(icon), icon);
    assert.equal(resolvePublicEventIcon(events.get(id)), icon, id);
  }

  // 例外登録のないイベントは33分類の固定順位に従う
  assert.equal(
    resolvePublicEventIcon({
      id: "not-an-exception",
      primary: "science",
      subs: ["biomed", "technology"],
    }),
    "technology-innovation"
  );
});

test("two L3 genetics events retain technology icons", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  for (const id of [
    "1973-recombinant-dna-plasmids",
    "2012-crispr-cas9-programmable-cleavage",
  ]) {
    assert.ok(events.has(id), id);
    assert.equal(
      Object.hasOwn(L3_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );
    assert.equal(
      resolvePublicEventIcon(events.get(id)),
      "technology-innovation",
      id
    );
  }
});

test("reviewed L2 work icon exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1848-communist-manifesto", "thought"],
    ["1879-ibsen-dolls-house", "literature-world"],
    ["1901-12c0p9f", "literature-japan"],
    ["1920-iqv58o", "fallback-work"],
    ["1929-kobayashi-kani-kosen", "literature-japan"],
    ["1942-5j1pxv", "art"],
    ["1958-achebe-things-fall-apart", "literature-world"],
    ["1962-solzhenitsyn-one-day", "literature-world"],
    ["1966-black-girl-sembene", "visual-work"],
    ["1973-solzhenitsyn-gulag-archipelago", "literature-world"],
    ["1978-said-orientalism", "thought"],
    ["1981-midnights-children", "literature-world"],
    ["1989-crenshaw-intersection-race-sex", "thought"],
  ]);

  assert.deepEqual(
    new Map(Object.entries(L2_WORK_EVENT_ICON_OVERRIDES)),
    expected
  );

  for (const [id, icon] of expected) {
    const event = events.get(id);
    assert.ok(event, id);
    assert.equal(event.primary, "work", id);
    // 2026-11-15の思想監査による最新表示判断を優先する。
    const currentIcon = id === "1989-crenshaw-intersection-race-sex"
      ? "gender"
      : icon;
    assert.equal(resolvePublicEventIcon(event), currentIcon, id);
  }

  // 現行維持候補の3件には例外を適用しない
  for (const id of [
    "1969-left-hand-darkness",
    "1985-1tbwzkp",
    "1990-butler-gender-trouble",
  ]) {
    assert.equal(
      Object.hasOwn(L2_WORK_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );
    assert.equal(
      resolvePublicEventIcon(events.get(id)),
      "gender",
      id
    );
  }
});

test("reviewed L2 science icon exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1712-1374ya3", "technology-innovation"],
    ["1876-otto-four-stroke-engine", "technology-innovation"],
    ["1910-salvarsan-ehrlich-hata", "life-health"],
    ["1948-streptomycin-randomized-trial", "life-health"],
    ["1968-kimura-neutral-theory", "life-science"],
    ["1978-first-ivf-birth", "life-health"],
    ["1982-gilligan-different-voice", "thought"],
    ["1997-35uh4v", "life-science"],
    ["2006-ips-cells", "life-science"],
    ["2020-mrna-vaccine-first-approval", "life-health"],
  ]);

  assert.deepEqual(
    new Map(Object.entries(L2_SCIENCE_EVENT_ICON_OVERRIDES)),
    expected
  );

  for (const [id, icon] of expected) {
    const event = events.get(id);
    assert.ok(event, id);
    assert.equal(event.primary, "science", id);
    assert.equal(resolvePublicEventIcon(event), icon, id);
  }

  // 固定順位を維持する11件に例外を適用しない
  const keeps = new Map([
    ["1879-rmo2g5", "energy"],
    ["1888-tesla-polyphase-ac-motor", "energy"],
    ["1906-1aai833", "technology-innovation"],
    ["1913-bragg-xray-crystallography", "technology-innovation"],
    ["1971-first-clinical-ct", "technology-innovation"],
    ["1973-mri-development", "technology-innovation"],
    ["1975-kohler-milstein-monoclonal-antibodies", "technology-innovation"],
    ["1977-sanger-dideoxy-sequencing", "technology-innovation"],
    ["1985-lithium-ion-battery", "energy"],
    ["1985-pcr-dna-amplification", "technology-innovation"],
    ["1989-1993-blue-led-gan", "technology-innovation"],
  ]);

  assert.equal(keeps.size, 11);

  // 2026-11-15 Safari実使用監査で技術革新へ変更
  const chicagoPile = events.get("1942-chicago-pile-1");
  assert.ok(chicagoPile);
  assert.equal(chicagoPile.primary, "science");
  assert.equal(
    resolvePublicEventIcon(chicagoPile),
    "technology-innovation"
  );

  for (const [id, icon] of keeps) {
    const event = events.get(id);
    assert.ok(event, id);
    assert.equal(event.primary, "science", id);
    assert.equal(
      Object.hasOwn(L2_SCIENCE_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );
    assert.equal(resolvePublicEventIcon(event), icon, id);
  }
});

test("reviewed L2 society war and colonialism exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1519-tenochtitlan-conquest", "war"],
    ["1857-indian-rebellion", "war"],
    ["1896-battle-adwa", "war"],
    ["1904-1s6rxzz", "war"],
    ["1931-100fw5a", "war"],
    ["1807-british-slave-trade-abolition", "rights-expand"],
    ["1834-british-slavery-abolition", "rights-expand"],
    ["1909-gandhi-hind-swaraj", "thought"],
    ["1948-apartheid-state-policy", "rights-suppress"],
    ["1955-bandung-conference", "politics-world"],
    ["1960-decolonization-declaration", "rights-expand"],
    ["1994-south-africa-democratic-election", "rights-expand"],
  ]);

  for (const [id, icon] of expected) {
    const event = events.get(id);
    assert.ok(event, id);
    assert.equal(event.primary, "society", id);
    assert.equal(
      L2_SOCIETY_EVENT_ICON_OVERRIDES[id],
      icon,
      id
    );
    const currentIcon = id === "1960-decolonization-declaration"
      ? "colonialism"
      : icon;
    assert.equal(resolvePublicEventIcon(event), currentIcon, id);
  }

  // 第1・第2群で現行維持と判断した8件
  for (const id of [
    "1510-portuguese-goa-malacca",
    "1600-east-india-companies",
    "1607-jamestown",
    "1840-treaty-waitangi",
    "1885-berlin-conference",
    "1910-annexation-of-korea",
    "1919-may-fourth-movement",
    "1954-algerian-war-independence",
  ]) {
    assert.ok(events.has(id), id);
    assert.equal(
      Object.hasOwn(L2_SOCIETY_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );
    assert.equal(
      resolvePublicEventIcon(events.get(id)),
      "colonialism",
      id
    );
  }
});

test("reviewed L2 society labor and rights exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1833-factory-act", "law"],
    ["1861-russian-serf-emancipation", "rights-expand"],
    ["1893-nz-womens-suffrage", "rights-expand"],
    ["1925-universal-male-suffrage", "rights-expand"],
    ["1946-women-first-general-election", "rights-expand"],
    ["1947-1898wdp", "law"],
    ["1979-cedaw", "law"],
    ["1985-tyby33", "law"],
    ["2001-netherlands-same-sex-marriage", "rights-expand"],
  ]);

  assert.equal(
    Object.keys(L2_SOCIETY_EVENT_ICON_OVERRIDES).length,
    28
  );

  for (const [id, icon] of expected) {
    const event = events.get(id);

    assert.ok(event, id);
    assert.equal(event.primary, "society", id);

    assert.equal(
      L2_SOCIETY_EVENT_ICON_OVERRIDES[id],
      icon,
      id
    );

    const currentIcon = id === "1946-women-first-general-election"
      ? "gender"
      : icon;

    assert.equal(
      resolvePublicEventIcon(event),
      currentIcon,
      id
    );
  }

  // 現行の労働アイコンを維持する3件
  for (const id of [
    "1883-german-social-insurance",
    "1911-taylor-scientific-management",
    "1919-ilo-founded",
  ]) {
    const event = events.get(id);

    assert.ok(event, id);

    assert.equal(
      Object.hasOwn(L2_SOCIETY_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );

    assert.equal(
      resolvePublicEventIcon(event),
      "labor",
      id
    );
  }
});

test("reviewed L2 society economy and environment exceptions", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const expected = new Map([
    ["1859-drake-spindletop-petroleum", "industry"],
    ["1946-second-land-reform", "law"],
    ["1960-opec-founding", "economy"],
    ["1973-4wgbkc", "economy"],
    ["1986-163vwou", "environment"],
    ["1993-maastricht-eu", "law"],
    ["2011-au3xzt", "environment"],
  ]);

  assert.equal(
    Object.keys(L2_SOCIETY_EVENT_ICON_OVERRIDES).length,
    28
  );

  for (const [id, icon] of expected) {
    const event = events.get(id);

    assert.ok(event, id);
    assert.equal(event.primary, "society", id);

    assert.equal(
      L2_SOCIETY_EVENT_ICON_OVERRIDES[id],
      icon,
      id
    );

    assert.equal(
      resolvePublicEventIcon(event),
      icon,
      id
    );
  }

  // 現行アイコン維持の4件
  const keeps = new Map([
    ["1845-irish-famine-corn-laws", "food"],
    ["1869-suez-canal-opening", "transport-ship"],
    ["1944-bretton-woods", "economy"],
    ["1948-gatt-entry-into-force", "economy"],
  ]);

  for (const [id, icon] of keeps) {
    const event = events.get(id);

    assert.ok(event, id);

    assert.equal(
      Object.hasOwn(L2_SOCIETY_EVENT_ICON_OVERRIDES, id),
      false,
      id
    );

    assert.equal(
      resolvePublicEventIcon(event),
      icon,
      id
    );
  }
});

test("reviewed L2 culture education computer icons", () => {
  const events = new Map(
    readPublicEvents().map((event) => [event.id, event])
  );

  const groups = [
    ["culture", L2_CULTURE_EVENT_ICON_OVERRIDES, [
      ["1900-women-first-olympics", "gender"],
      ["1904-mitsukoshi-department-store", "industry"],
      ["1964-moog-synthesizer", "music"],
      ["1984-la-olympics-finance", "economy"],
    ]],
    ["education", L2_EDUCATION_EVENT_ICON_OVERRIDES, [
      ["1862-morrill-land-grant-act", "law"],
      ["1899-secondary-education-orders", "law"],
      ["1953-bantu-education-act-south-africa", "rights-suppress"],
      ["1972-title-ix-us-education", "rights-expand"],
      ["2004-national-university-corporations", "law"],
    ]],
    ["computer", L2_COMPUTER_EVENT_ICON_OVERRIDES, [
      ["1975-1chrsuf", "technology-innovation"],
    ]],
  ];

  const maps = Object.fromEntries(
    groups.map(([primary, overrides]) => [
      primary,
      overrides,
    ])
  );

  for (const [primary, overrides, expected] of groups) {
    assert.deepEqual(
      Object.entries(overrides),
      expected,
      primary
    );

    for (const [id, icon] of expected) {
      const event = events.get(id);
      assert.ok(event, id);
      assert.equal(event.primary, primary, id);
      const latestIcons = {
        "1964-moog-synthesizer": "technology-implementation",
        "2004-national-university-corporations": "fallback-education",
      };
      const currentIcon = latestIcons[id] ?? icon;

      assert.equal(
        resolvePublicEventIcon(event),
        currentIcon,
        id
      );
    }
  }

  const keeps = new Map([
    ["1765-harunobu-nishikie", "art"],
    ["1861-arts-crafts-morris", "art"],
    ["1863-football-association", "sport"],
    ["1924-first-winter-olympics", "sport"],
    ["1930-first-fifa-world-cup", "sport"],
    ["1948-paralympic-movement", "sport"],
    ["1958-chicken-ramen", "food"],
    ["1970-1h4rfm5", "food"],
    ["1992-living-in-bondage", "industry"],
    ["1993-jleague-opening", "sport"],
    ["1835-macaulay-minute-indian-education", "colonialism"],
    ["1911-korean-education-ordinance", "colonialism"],
    ["1947-japan-teachers-union-founded", "labor"],
  ]);

  assert.equal(keeps.size, 13);

  for (const [id, icon] of keeps) {
    const event = events.get(id);
    assert.ok(event, id);

    assert.equal(
      Object.hasOwn(maps[event.primary], id),
      false,
      id
    );

    assert.equal(
      resolvePublicEventIcon(event),
      icon,
      id
    );
  }
});
