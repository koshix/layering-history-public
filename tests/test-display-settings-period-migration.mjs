import assert from "node:assert/strict";
import {
  normalizeSavedClosedStages,
} from "../src/useDisplaySettings.js";

const oldKeys = [];
for (let century = 16; century <= 19; century++) {
  oldKeys.push(
    `pre-${century}-first`,
    `pre-${century}-second`
  );
}

const allClosed = normalizeSavedClosedStages(oldKeys);

for (let century = 11; century <= 18; century++) {
  assert.equal(
    allClosed.has(`pre-${century}-century`),
    true
  );
}

assert.equal(allClosed.has("pre-19-first"), true);
assert.equal(allClosed.has("pre-19-second"), true);
assert.equal(allClosed.has("pre-16-first"), false);

const partial = normalizeSavedClosedStages([
  "pre-16-first",
  "pre-17-first",
  "pre-17-second",
  "pre-19-first",
  "elem",
]);

assert.equal(partial.has("pre-16-century"), false);
assert.equal(partial.has("pre-17-century"), true);
assert.equal(partial.has("pre-11-century"), false);
assert.equal(partial.has("pre-19-first"), true);
assert.equal(partial.has("elem"), true);

assert.equal(
  normalizeSavedClosedStages([]).size,
  0
);

const migratedAgain = normalizeSavedClosedStages(
  [...allClosed]
);

assert.deepEqual(migratedAgain, allClosed);

console.log(
  "OK: 旧期間枠の開閉設定移行と再適用を検証しました"
);
