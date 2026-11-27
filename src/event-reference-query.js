// Wikipedia検索語の正本は公開TSV。
// 未指定の場合のみタイトルから生成する。

const GENERIC_WORK_PREFIXES = new Set([
  "映画",
  "映画版",
  "アニメ映画",
  "小説",
  "長編小説",
  "短編小説",
  "漫画",
  "テレビアニメ",
  "テレビドラマ",
  "ゲーム",
  "楽曲",
  "シングル",
  "アルバム",
]);

const ACTION_SUFFIX =
  /(?:を|が|の)?(?:劇場公開|一般公開|開発開始|運用開始|サービス開始|販売開始|刊行|発売|公開|発表|制作|設立|発足|開始|完成|公布|採択|承認|受賞|登場)$/;

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripActionSuffix(value) {
  return cleanText(value)
    .replace(ACTION_SUFFIX, "")
    .trim();
}

// 括弧の内部にある区切り文字は作品名等の一部として保持する。
const BRACKETS = new Map([
  ["『", "』"],
  ["《", "》"],
  ["「", "」"],
  ["（", "）"],
  ["(", ")"],
  ["〈", "〉"],
  ["【", "】"],
]);

function splitOutside(text, separators) {
  const stack = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (
      stack.length &&
      ch === stack[stack.length - 1]
    ) {
      stack.pop();
      continue;
    }

    if (BRACKETS.has(ch)) {
      stack.push(BRACKETS.get(ch));
      continue;
    }

    if (
      !stack.length &&
      separators.some(s => text.startsWith(s, i))
    ) {
      return text.slice(0, i).trim();
    }
  }

  return text.trim();
}

export function buildWikipediaQuery(
  title,
  fallbackQuery = "",
  wikiQuery = ""
) {
  const explicit = String(wikiQuery ?? "").trim();
  if (explicit) return explicit;

  const source = cleanText(title);
  const fallback = cleanText(fallbackQuery);

  if (!source) return fallback;

  // 歴史的な意味付けの説明節を先に除く。
  const head = splitOutside(source, ["――"]);

  // 『作品名』と《作品名》を同等に扱う。
  const quoted = head.match(
    /^(.*?)(?:『([^』]+)』|《([^》]+)》)/
  );

  if (quoted) {
    const rawPrefix = cleanText(quoted[1]);
    const workTitle = cleanText(quoted[2] ?? quoted[3]);

    const prefix = GENERIC_WORK_PREFIXES.has(rawPrefix)
      ? ""
      : stripActionSuffix(rawPrefix);

    return cleanText(
      [prefix, workTitle].filter(Boolean).join(" ")
    ) || fallback;
  }

  // 読点による説明節の分離でも括弧内部を保持する。
  const firstClause =
    splitOutside(head, ["、", "，"]);

  const compact = stripActionSuffix(
    firstClause
  )
    .replace(/[「」『』《》]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return compact || fallback;
}
