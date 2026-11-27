import assert from "node:assert/strict";

import {
  buildWikipediaQuery,
} from "../src/event-reference-query.js";

const cases = [
  [
    "マイケル・クライトン『アンドロメダ病原体』刊行",
    "Michael Crichton Andromeda Strain 1969 Knopf microorganism Wildfire",
    "マイケル・クライトン アンドロメダ病原体",
  ],
  [
    "ル＝グウィン『闇の左手』刊行",
    "Ursula Le Guin Left Hand Darkness 1969 March Gethen gender",
    "ル＝グウィン 闇の左手",
  ],
  [
    "筒井康隆『虚人たち』刊行",
    "筒井康隆 虚人たち 1981年4月 中央公論社 メタフィクション",
    "筒井康隆 虚人たち",
  ],
  [
    "映画『AKIRA』公開",
    "AKIRA 1988年7月16日 大友克洋 ネオ東京 cyberpunk anime アキラ",
    "AKIRA",
  ],
  [
    "TSMC設立、半導体の専業ファウンドリーモデルを確立",
    "TSMC founded February 21 1987 Morris Chang pure play foundry",
    "TSMC",
  ],
  [
    "モントリオール議定書の採択",
    "Montreal Protocol September 16 1987 ozone CFC",
    "モントリオール議定書",
  ],
  [
    "",
    "fallback search words",
    "fallback search words",
  ],
  [
    "ChatGPT一般公開――対話型生成AIが社会へ普及する転換点",
    "",
    "ChatGPT",
  ],
  [
    "ヨハン・ゼバスティアン・バッハ《マタイ受難曲》初演――宗教音楽とバロック表現を集大成",
    "",
    "ヨハン・ゼバスティアン・バッハ マタイ受難曲",
  ],
  [
    "J・M・W・ターナー《雨、蒸気、速度―グレート・ウェスタン鉄道》――近代の速度を絵画の主題へ",
    "",
    "J・M・W・ターナー 雨、蒸気、速度―グレート・ウェスタン鉄道",
  ],
  [
    "ビチトル《ジャハーンギール、スーフィー聖者を諸王より優先する》――ムガル宮廷画",
    "",
    "ビチトル ジャハーンギール、スーフィー聖者を諸王より優先する",
  ],
  [
    "ハーラン・エリスン「おれには口がない、それでもおれは叫ぶ」発表――敵対的AI",
    "",
    "ハーラン・エリスン おれには口がない、それでもおれは叫ぶ",
  ],
  [
    "ダーウィンとウォレスの自然選択説――生物進化を説明し『種の起源』へ",
    "",
    "ダーウィンとウォレスの自然選択説",
  ],
  [
    "小説『架空の作品――副題』刊行――説明節",
    "",
    "架空の作品――副題",
  ],
  [
    "画家《架空の作品――副題》――説明節",
    "",
    "画家 架空の作品――副題",
  ],
  [
    "制度（国内、国外）の制定――説明節",
    "",
    "制度（国内、国外）の制定",
  ],
  [
    "チキンラーメンからカップヌードルへ――即席麺の革新",
    "",
    "チキンラーメンからカップヌードルへ",
  ],
  [
    "   ",
    "  fallback   words  ",
    "fallback words",
  ],
];

for (const [
  title,
  fallback,
  expected,
] of cases) {
  assert.equal(
    buildWikipediaQuery(
      title,
      fallback
    ),
    expected,
    title || "(empty title)"
  );
}

console.log(
  `OK: Wikipedia検索語 ${cases.length}ケースを検査しました`
);

// TSVで明示した検索語を優先する。

assert.equal(
  buildWikipediaQuery(
    "新しい題名――説明",
    "YouTube用検索語",
    '人物名 OR "作品名"'
  ),
  '人物名 OR "作品名"'
);

assert.equal(
  buildWikipediaQuery("別の題名――説明", "", ""),
  "別の題名"
);

assert.equal(
  buildWikipediaQuery("別の題名――説明", "", null),
  "別の題名"
);

assert.equal(
  buildWikipediaQuery("題名", "", "  A OR B  "),
  "A OR B"
);

console.log("OK: TSV検索語の優先と自動生成への復帰");
