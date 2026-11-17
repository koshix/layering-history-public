import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Atom, Box, Flag } from "lucide-react";

import {
  PUBLIC_EVENT_ICON_NAMES,
} from "../src/event-icon.js";

import {
  LUCIDE_EVENT_ICONS,
} from "../src/lucide-icon-map.js";

test("Lucide mapping covers every semantic icon", () => {
  const expected = [
    ...PUBLIC_EVENT_ICON_NAMES,
    "flag",
  ].sort();

  assert.deepEqual(
    Object.keys(LUCIDE_EVENT_ICONS).sort(),
    expected
  );

  assert.equal(LUCIDE_EVENT_ICONS["matter-physics"], Atom);
  assert.equal(LUCIDE_EVENT_ICONS["matter-material"], Box);
  assert.equal(LUCIDE_EVENT_ICONS.flag, Flag);
});

test("every mapped Lucide icon renders SVG", () => {
  for (const [name, Component] of Object.entries(
    LUCIDE_EVENT_ICONS
  )) {
    const markup = renderToStaticMarkup(
      createElement(Component, {
        size: 18,
        color: "currentColor",
        "aria-hidden": true,
      })
    );

    assert.ok(markup.startsWith("<svg "), name);
    assert.match(markup, /width="18"/, name);
    assert.match(markup, /height="18"/, name);
  }
});

test("seven additional semantic icons map to Lucide", async () => {
  const L = await import("lucide-react");

  const expected = {
    sport: "Dumbbell",
    food: "Wheat",
    energy: "Zap",
    transport: "TrainFront",
    labor: "HardHat",
    gender: "VenusAndMars",
    colonialism: "Map",
  };

  for (const [tag, name] of Object.entries(expected)) {
    assert.ok(PUBLIC_EVENT_ICON_NAMES.has(tag), tag);
    assert.equal(LUCIDE_EVENT_ICONS[tag], L[name], tag);
  }
});

test("transport vehicle variants render", async () => {
  const L = await import("lucide-react");

  assert.equal(LUCIDE_EVENT_ICONS.transport, L.TrainFront);
  assert.equal(LUCIDE_EVENT_ICONS["transport-plane"], L.Plane);
  assert.equal(LUCIDE_EVENT_ICONS["transport-car"], L.CarFront);
  assert.equal(LUCIDE_EVENT_ICONS["transport-ship"], L.Ship);
});
