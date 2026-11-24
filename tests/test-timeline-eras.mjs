import assert from "node:assert/strict";
import {
  backgroundEraOf,
  halfCenturyMarkerOf,
  japaneseEraOf,
  preBirthPeriodsOf,
} from "../src/timeline-eras.js";

assert.equal(backgroundEraOf(1500), null);
assert.equal(
  backgroundEraOf(1501)?.key,
  "early-modern-world"
);
assert.equal(
  backgroundEraOf(1581)?.key,
  "early-modern-world"
);
assert.equal(
  backgroundEraOf(1582)?.key,
  "scientific-revolution"
);
assert.equal(
  backgroundEraOf(1687)?.key,
  "scientific-revolution"
);
assert.equal(
  backgroundEraOf(1688)?.key,
  "enlightenment"
);
assert.equal(
  backgroundEraOf(1945)?.key,
  "world-wars"
);
assert.equal(
  backgroundEraOf(1946)?.key,
  "postwar"
);
assert.equal(
  backgroundEraOf(2026)?.key,
  "ai-postpandemic"
);

assert.equal(japaneseEraOf(1867), null);
assert.equal(japaneseEraOf(1868)?.label, "明治");
assert.equal(japaneseEraOf(1912)?.label, "大正");
assert.equal(japaneseEraOf(1926)?.label, "昭和");
assert.equal(japaneseEraOf(1989)?.label, "平成");
assert.equal(japaneseEraOf(2019)?.label, "令和");

assert.equal(halfCenturyMarkerOf(2000), null);
assert.equal(
  halfCenturyMarkerOf(2001)?.key,
  "21c-first"
);
assert.equal(
  halfCenturyMarkerOf(2050)?.key,
  "21c-first"
);
assert.equal(halfCenturyMarkerOf(2051), null);

assert.equal(preBirthPeriodsOf(1001).length, 0);
assert.equal(preBirthPeriodsOf(1501).length, 5);
assert.deepEqual(preBirthPeriodsOf("invalid"), []);

{
  const periods = preBirthPeriodsOf(1953);

  assert.equal(periods.length, 12);
  assert.deepEqual(periods[0], {
    key: "pre-11-century",
    label: "11世紀",
    from: 1001,
    to: 1100,
  });
  assert.deepEqual(periods[1], {
    key: "pre-12-century",
    label: "12世紀",
    from: 1101,
    to: 1200,
  });
  assert.deepEqual(periods[5], {
    key: "pre-16-century",
    label: "16世紀",
    from: 1501,
    to: 1600,
  });
  assert.deepEqual(periods[7], {
    key: "pre-18-century",
    label: "18世紀",
    from: 1701,
    to: 1800,
  });
  assert.deepEqual(periods[8], {
    key: "pre-19-first",
    label: "19世紀前半",
    from: 1801,
    to: 1850,
  });
  assert.deepEqual(periods.at(-1), {
    key: "pre-20-second",
    label: "20世紀後半",
    from: 1951,
    to: 1952,
  });
}

console.log(
  "OK: 背景史・元号・出生前期間の境界を検査しました"
);
