import { spawnSync } from "node:child_process";

import {
  PUBLIC_EVENT_TSV_HEADER,
} from "../src/event-schema.js";

export const EVENT_BUILDER = "scripts/build-events.mjs";

export const clean = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\r?\n/g, " ");

export function eventId(year, title) {
  const source = `${year}-${title}`;
  let hash = 5381;

  for (let i = 0; i < source.length; i += 1) {
    hash = ((hash * 33) ^ source.charCodeAt(i)) >>> 0;
  }

  return `${year}-${hash.toString(36)}`;
}

export function readRows(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(Boolean);

  const header = lines[0]?.split("\t") ?? [];

  if (
    header.join("\t") !==
    PUBLIC_EVENT_TSV_HEADER.join("\t")
  ) {
    throw new Error(
      "events.tsv のヘッダーが想定と違います"
    );
  }

  return lines.slice(1).map((line) => {
    const cells = line.split("\t");

    return Object.fromEntries(
      header.map(
        (key, index) => [
          key,
          cells[index] ?? "",
        ]
      )
    );
  });
}

export function sortRowsByDate(rows) {
  return [...rows].sort(
    (a, b) => a.date.localeCompare(b.date)
  );
}

export function serializeRows(rows) {
  return [
    PUBLIC_EVENT_TSV_HEADER.join("\t"),
    ...rows.map((row) =>
      PUBLIC_EVENT_TSV_HEADER
        .map((key) => row[key] ?? "")
        .join("\t")
    ),
  ].join("\n") + "\n";
}

export function runBuilder() {
  const result = spawnSync(
    process.execPath,
    [EVENT_BUILDER],
    { stdio: "inherit" }
  );

  return result.status === 0;
}
