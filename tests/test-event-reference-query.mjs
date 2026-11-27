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

// 個別検索語とタイトル変更時の互換性。
assert.equal(buildWikipediaQuery("Pythonを初めて一般公開――可読性と汎用性を重視するプログラミング言語", "", "1991-python-public-release"), "Python");
assert.equal(buildWikipediaQuery("ワインベルグが平衡原理を発表、ハーディも独立に定式化――集団遺伝学の基準線", "", "1908-hardy-weinberg-equilibrium"), "ハーディー・ワインベルクの法則");
assert.equal(buildWikipediaQuery("ガイム、ノボセロフらがグラフェンを単離し電界効果を実証", "", "2004-graphene-isolation"), "グラフェン");
assert.equal(buildWikipediaQuery("ルジャンドルからガウスへ――最小二乗法で観測データから値を推定する", "", "1805-16vi2it"), "最小二乗法");
assert.equal(buildWikipediaQuery("イタリア王国成立からローマ併合へ――イタリア統一", "", "1861-italian-unification"), "イタリア統一");
assert.equal(buildWikipediaQuery("ADSLからFTTHへ、家庭のインターネットが常時・高速接続へ", "", "2000-flets-adsl"), "ADSL FTTH");

assert.equal(
  buildWikipediaQuery("新しい題名――説明", "",
    "1991-python-public-release"),
  "新しい題名"
);

assert.equal(
  buildWikipediaQuery("新しい題名――説明", "",
    "unknown-event"),
  "新しい題名"
);

console.log("OK: 個別検索語とタイトル変更互換性");

assert.equal(buildWikipediaQuery("ドレーク井からスピンドルトップへ――石油が産業基盤になる", "", "1859-drake-spindletop-petroleum"), "石油産業");

assert.equal(buildWikipediaQuery("ヘルツシュプルング＝ラッセル図からペインへ――恒星を温度・光度・組成で読む", "", "1911-1925-hr-diagram-payne"), "HR図");

assert.equal(buildWikipediaQuery("東京電燈から九電力体制へ――電気が日本の基幹インフラになる", "", "1887-1w6fw9z"), "日本の電力会社");

assert.equal(buildWikipediaQuery("NTT発足から国鉄分割民営化へ――公企業民営化の時代", "", "1985-ntt-privatization"), "民営化");

assert.equal(buildWikipediaQuery("BigtableからDynamoへ、Web規模のデータを分散保存", "", "2006-1pgqppv"), "NoSQL");

assert.equal(buildWikipediaQuery("o1からDeepSeek-R1へ――推論時の計算量を活用して性能を高める生成AI", "", "2024-reasoning-models-o1-deepseek-r1"), "DeepSeek-R1");

assert.equal(buildWikipediaQuery("川久保玲・山本耀司がパリで発表、日本の前衛服飾が世界へ", "", "1981-h4ir7z"), "川久保玲 山本耀司");

assert.equal(buildWikipediaQuery("インディアス新法からバリャドリード論争へ――先住民支配を再検討", "", "1542-new-laws-indies"), "バリャドリッド論争");
