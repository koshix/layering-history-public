import assert from "node:assert/strict";
import fs from "node:fs";

import {
  eventYear,
  eventDisplayPeriod,
  formatEventPeriod,
  formatEventLifeRange,
} from "../src/event-schema.js";

import {
  parsePublicEventsTsv,
} from "../src/public-events-tsv.js";

const formatDate = value => {
  const [year, month, day] = value.split("-");
  return `${Number(year)}年`
    + (month ? `${Number(month)}月` : "")
    + (day ? `${Number(day)}日` : "");
};

const gradeLabel = year =>
  year < 1950
    ? `${1950 - year}年前`
    : `${year - 1950}歳`;

const cases = [
  ["1958-08-25", "", "1958年8月25日"],
  ["1958", "1971", "1958年〜1971年"],
  ["1958-08", "1971-09", "1958年8月〜1971年9月"],
  [
    "1958-08-25", "1971-09-18",
    "1958年8月25日〜1971年9月18日",
  ],
  [
    "1969-08-15", "1969-08-18",
    "1969年8月15日〜1969年8月18日",
  ],
  ["1795-04-07", "1960", "1795年4月7日〜1960年"],
  ["1872", "1874-04-15", "1872年〜1874年4月15日"],
  ["2000-12-26", "2008-06", "2000年12月26日〜2008年6月"],
  ["1872", "1872-04-15", "1872年〜1872年4月15日"],
  ["2000", "1999", "2000年"],
  ["2000", "invalid", "2000年"],
];

for (const [date, end_date, expected] of cases) {
  const event = { date, end_date };

  assert.equal(
    formatEventPeriod(event, formatDate),
    expected
  );

  assert.equal(
    eventDisplayPeriod(event).startYear,
    eventYear(event)
  );
}

const sameYear = {
  date: "1969-08-15",
  end_date: "1969-08-18",
  age: 19,
};

assert.equal(eventDisplayPeriod(sameYear).hasPeriod, true);
assert.equal(eventDisplayPeriod(sameYear).spansYears, false);
assert.equal(formatEventLifeRange(sameYear, gradeLabel), "");

assert.equal(
  formatEventLifeRange(
    { date: "1958", end_date: "1971", age: 8 },
    gradeLabel
  ),
  "8歳〜21歳"
);

assert.equal(
  formatEventLifeRange(
    { date: "1945", end_date: "1955", age: -5 },
    gradeLabel
  ),
  "5年前〜5歳"
);

assert.equal(
  formatEventLifeRange(
    { date: "1958", end_date: "1971" },
    gradeLabel
  ),
  ""
);

assert.equal(
  formatEventLifeRange(
    { date: "1958", end_date: "1971", age: 8 },
    () => ""
  ),
  ""
);

const events = parsePublicEventsTsv(
  fs.readFileSync(
    new URL("../public/events.tsv", import.meta.url),
    "utf8"
  )
);

assert.equal(events.length, 2240);

let periods = 0;
let sameYearPeriods = 0;
let crossYearPeriods = 0;

for (const event of events) {
  const p = eventDisplayPeriod(event);

  assert.equal(p.startYear, eventYear(event));

  if (event.end_date) {
    assert.equal(p.hasPeriod, true, event.id);
    assert.equal(p.end, event.end_date);

    periods++;

    if (p.spansYears) {
      crossYearPeriods++;
    } else {
      sameYearPeriods++;
    }

    assert.equal(
      formatEventPeriod(event, formatDate),
      formatDate(event.date)
        + "〜"
        + formatDate(event.end_date)
    );
  } else {
    assert.equal(p.hasPeriod, false);

    assert.equal(
      formatEventPeriod(event, formatDate),
      formatDate(event.date)
    );
  }
}

assert.equal(periods, 443);
assert.equal(sameYearPeriods, 57);
assert.equal(crossYearPeriods, 386);

console.log("OK: 2240件の日付表示");
console.log("OK: 443期間イベント");
console.log("OK: 同一年57件・複数年386件");
console.log("OK: 日付精度・人生段階の互換性");
