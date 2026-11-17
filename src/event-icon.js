// Public timeline icon selection.
//
// Principle:
// - Representative icons follow a fixed priority based on subs frequency.
// - Original 23-tag order fixed on 2026-11-07 as historical baseline.
// - All 33 official subs refrozen on 2026-11-14 using 2021 events.
// - Equal counts preserve previous rank, then schema order.
// - Event-specific icon exceptions are a separate review stage.
// - Routine event edits do not change the priority.
// - Reconsider only after major data or taxonomy changes.
// - See docs/ICON-PRIORITY.md.
// - Some tags then split into two visual subtypes.
// - If subs is empty, primary supplies a fallback icon.
// - Icons are derived at display time and are not stored in event TSV data.

export const SUB_ICON_PRIORITY = [
  "sport",
  "game",
  "food",
  "energy",
  "revolution",
  "architecture",
  "religion",
  "transport",
  "labor",
  "design",
  "stage",
  "gender",
  "communication",
  "colonialism",
  "life",
  "environment",
  "industry",
  "media",
  "technology",
  "space",
  "war",
  "math",
  "visual",
  "biomed",
  "economy",
  "law",
  "music",
  "matter",
  "art",
  "rights",
  "thought",
  "literature",
  "politics",
];

export const PUBLIC_EVENT_ICON_NAMES = new Set([
  "politics-japan",
  "politics-world",
  "literature-japan",
  "literature-world",
  "rights-expand",
  "rights-suppress",
  "technology-innovation",
  "technology-implementation",
  "matter-physics",
  "matter-material",
  "war",
  "visual-work",
  "visual-media",
  "media",
  "economy",
  "law",
  "communication",
  "industry",
  "music",
  "life-science",
  "life-health",
  "thought",
  "space",
  "environment",
  "art",
  "stage",
  "design",
  "math",
  "revolution",
  "game",
  "architecture",
  "religion",
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
  "fallback-work",
  "fallback-science",
  "fallback-education",
  "fallback-computer",
  "fallback-culture",
  "fallback-society",
]);

// Vehicle-specific display icons; does not modify subs or priority.
export const TRANSPORT_MODE_ICON_BY_ID = Object.freeze({
  "1519-first-circumnavigation": "transport-ship",
  "1807-fulton-steamboat": "transport-ship",
  "1869-suez-canal-opening": "transport-ship",
  "1956-ideal-x-container": "transport-ship",
  "1903-1mfla0p": "transport-plane",
  "1939-heinkel-he178-jet-flight": "transport-plane",
  "1951-xkel23": "transport-plane",
  "1978-qi3v18": "transport-plane",
  "1886-benz-patent-motorwagen": "transport-car",
  "1958-5d0cnk": "transport-car",
  "1963-1dgar7d": "transport-car",
  "1981-13xeypj": "transport-car",
});

// Reviewed L1 display exceptions; taxonomy and priority unchanged.
export const L1_EVENT_ICON_OVERRIDES = Object.freeze({
  "1532-inca-conquest": "war",
  "1542-new-laws-indies": "law",
  "1556-agricola-de-re-metallica": "matter-material",
  "1569-mercator-world-map": "math",
  "1672-royal-african-company": "rights-suppress",
  "1756-seven-years-war": "war",
  "1757-battle-plassey": "war",
  "1783-montgolfier-manned-flight": "technology-innovation",
  "1792-wollstonecraft-rights-woman": "thought",
  "1804-hanaoka-anesthesia": "life-health",
  "1813-1aqqlor": "thought",
  "1822-1rubsrv": "thought",
  "1848-california-gold-discovery": "economy",
  "1857-pjpctv": "art",
  "1858-ansei-five-power-treaties": "law",
  "1873-land-tax-reform": "law",
  "1876-sapporo-agricultural-college": "fallback-education",
  "1878-muybridge-horse-motion": "visual-media",
  "1885-zola-germinal": "literature-world",
  "1894-x6u61s": "war",
  "1895-l0jr6q": "literature-japan",
  "1897-projected-cinema-japan": "visual-media",
  "1898-spanish-american-war": "war",
  "1901-australian-federation": "politics-world",
  "1907-bakelite": "matter-material",
  "1908-hardy-weinberg-equilibrium": "life-science",
  "1908-water-chlorination": "life-health",
  "1910-suzuki-oryzanin-vitamins": "life-science",
  "1913-ford-moving-assembly-line": "industry",
  "1920-shochiku-kamata-studio": "visual-media",
  "1926-goddard-liquid-fuel-rocket": "space",
  "1927-bristol-sessions": "music",
  "1930-1tywc9t": "thought",
  "1930-salt-march": "rights-expand",
  "1931-dust-bowl-soil-conservation": "environment",
  "1931-lawrence-livingston-cyclotron": "matter-physics",
  "1932-13zsfb6": "art",
  "1935-italian-invasion-ethiopia": "war",
  "1936-1leh3e2": "thought",
  "1936-modern-times": "visual-work",
  "1945-kolff-dialysis": "life-health",
  "1947-1sxl276": "law",
  "1952-cosmotron-gev-synchrotron": "matter-physics",
  "1953-1955-ziegler-natta-polymerization": "matter-material",
  "1954-dien-bien-phu-geneva": "war",
  "1954-first-successful-kidney-transplant": "life-health",
  "1955-cesium-atomic-clock": "matter-physics",
  "1957-enchi-onna-zaka": "literature-japan",
  "1957-mother-india-film": "visual-work",
  "1957-ghana-independence": "rights-expand",
  "1958-hakujaden-toei": "visual-work",
  "1959-ishigaki-nabe-kama-hi": "literature-japan",
  "1959-1v71ner": "media",
  "1959-cern-proton-synchrotron": "matter-physics",
  "1960-mars1-seat-reservation": "fallback-computer",
  "1960-t8m1mf": "law",
  "1960-congo-crisis-onuc": "war",
  "1961-1c2uy15": "economy",
  "1963-1cxmigg": "law",
  "1963-oau-founded": "politics-world",
  "1967-first-human-heart-transplant": "life-health",
  "1968-sanya-blues": "music",
  "1969-stonewall-uprising": "rights-expand",
  "1970-1e6x89x": "media",
  "1971-teacher-salary-special-measures-law": "law",
  "1973-girl-who-was-plugged-in": "literature-world",
  "1975-female-man": "literature-world",
  "1975-png-independence": "rights-expand",
  "1976-17xlz76": "media",
  "1977-106jqc6": "literature-world",
  "1977-sherman-untitled-film-stills": "art",
  "1978-ito-hiromi-somoku-no-sora": "literature-japan",
  "1978-navstar1-gps": "space",
  "1978-nakazawa-umi-o-kanjiru-toki": "literature-japan",
  "1979-118a5r6": "literature-japan",
  "1980-roland-tr808": "music",
  "1980-noyori-binap": "matter-material",
  "1985-vkgzu4": "law",
  "1987-1266f54": "art",
  "1987-oxod7": "law",
  "1991-h5dxlf": "rights-expand",
  "1993-if6tn7": "art",
  "1993-matsuura-oyayubi-p": "literature-japan",
  "1994-19zyhc5": "art",
  "1994-1ws4rqu": "rights-expand",
  "1997-1q777m1": "literature-japan",
  "1998-1ew078w": "industry",
  "1999-in2v1v": "law",
  "1999-17pr3hn": "environment",
  "2003-top7-computational-protein-design": "life-science",
  "2005-11uldef": "fallback-computer",
  "2005-e57t6b": "life-science",
  "2008-kawakami-mieko-chichi-to-ran": "literature-japan",
  "2010-synthetic-genome-cell": "life-science",
  "2013-belt-and-road-initiative": "economy",
  "2013-ancillary-justice": "literature-world",
  "2016-murata-sayaka-convenience-store-woman": "literature-japan",
  "2017-metoo-global": "rights-expand",
  "2019-1lcqqks": "literature-world",
  "2020-1287bvf": "literature-world",
  "2025-teacher-salary-special-measures-revision": "law",
});

// Reviewed L3 display exceptions; subs and priority stay unchanged.
export const L3_EVENT_ICON_OVERRIDES = Object.freeze({
  "1545-potosi-silver": "economy",
  "1700-cristofori-piano": "music",
  "1839-first-opium-war": "war",
  "1867-marx-capital-volume1": "economy",
  "1867-lister-antiseptic-surgery": "life-health",
  "1928-v3n6qx": "life-health",
  "1936-keynes-general-theory": "economy",
  "1769-watt-steam-engine-patent": "technology-innovation",
  "1857-pasteur-microbes-pasteurization": "life-science",
});

// Reviewed L2 work display exceptions; taxonomy stays unchanged.
export const L2_WORK_EVENT_ICON_OVERRIDES = Object.freeze({
  "1848-communist-manifesto": "thought",
  "1879-ibsen-dolls-house": "literature-world",
  "1901-12c0p9f": "literature-japan",
  "1920-iqv58o": "fallback-work",
  "1929-kobayashi-kani-kosen": "literature-japan",
  "1942-5j1pxv": "art",
  "1958-achebe-things-fall-apart": "literature-world",
  "1962-solzhenitsyn-one-day": "literature-world",
  "1966-black-girl-sembene": "visual-work",
  "1973-solzhenitsyn-gulag-archipelago": "literature-world",
  "1978-said-orientalism": "thought",
  "1981-midnights-children": "literature-world",
  "1989-crenshaw-intersection-race-sex": "thought",
});

// Reviewed L2 science display exceptions; taxonomy stays unchanged.
export const L2_SCIENCE_EVENT_ICON_OVERRIDES = Object.freeze({
  "1712-1374ya3": "technology-innovation",
  "1876-otto-four-stroke-engine": "technology-innovation",
  "1910-salvarsan-ehrlich-hata": "life-health",
  "1948-streptomycin-randomized-trial": "life-health",
  "1968-kimura-neutral-theory": "life-science",
  "1978-first-ivf-birth": "life-health",
  "1982-gilligan-different-voice": "thought",
  "1997-35uh4v": "life-science",
  "2006-ips-cells": "life-science",
  "2020-mrna-vaccine-first-approval": "life-health",
});

// Reviewed L2 society display exceptions; taxonomy unchanged.
export const L2_SOCIETY_EVENT_ICON_OVERRIDES = Object.freeze({
  "1519-tenochtitlan-conquest": "war",
  "1857-indian-rebellion": "war",
  "1896-battle-adwa": "war",
  "1904-1s6rxzz": "war",
  "1931-100fw5a": "war",
  "1807-british-slave-trade-abolition": "rights-expand",
  "1834-british-slavery-abolition": "rights-expand",
  "1909-gandhi-hind-swaraj": "thought",
  "1948-apartheid-state-policy": "rights-suppress",
  "1955-bandung-conference": "politics-world",
  "1960-decolonization-declaration": "rights-expand",
  "1994-south-africa-democratic-election": "rights-expand",
  "1833-factory-act": "law",
  "1861-russian-serf-emancipation": "rights-expand",
  "1893-nz-womens-suffrage": "rights-expand",
  "1925-universal-male-suffrage": "rights-expand",
  "1946-women-first-general-election": "rights-expand",
  "1947-1898wdp": "law",
  "1979-cedaw": "law",
  "1985-tyby33": "law",
  "2001-netherlands-same-sex-marriage": "rights-expand",
  "1859-drake-spindletop-petroleum": "industry",
  "1946-second-land-reform": "law",
  "1960-opec-founding": "economy",
  "1973-4wgbkc": "economy",
  "1986-163vwou": "environment",
  "1993-maastricht-eu": "law",
  "2011-au3xzt": "environment",
});

// Reviewed L2 culture display exceptions; taxonomy unchanged.
export const L2_CULTURE_EVENT_ICON_OVERRIDES = Object.freeze({
  "1900-women-first-olympics": "gender",
  "1904-mitsukoshi-department-store": "industry",
  "1964-moog-synthesizer": "music",
  "1984-la-olympics-finance": "economy",
});

// Reviewed L2 education display exceptions; taxonomy unchanged.
export const L2_EDUCATION_EVENT_ICON_OVERRIDES = Object.freeze({
  "1862-morrill-land-grant-act": "law",
  "1899-secondary-education-orders": "law",
  "1953-bantu-education-act-south-africa": "rights-suppress",
  "1972-title-ix-us-education": "rights-expand",
  "2004-national-university-corporations": "law",
});

// Reviewed L2 computer display exceptions; taxonomy unchanged.
export const L2_COMPUTER_EVENT_ICON_OVERRIDES = Object.freeze({
  "1975-1chrsuf": "technology-innovation",
});

const RIGHTS_SUPPRESS_IDS = new Set([
  "1518-atlantic-slave-trade-licenses",
  "1672-royal-african-company",
  "1685-revocation-edict-nantes",
  "1858-ansei-purge",
  "1915-armenian-genocide",
  "1925-peace-preservation-law",
  "1933-holocaust",
  "1937-nanjing-massacre",
  "1948-apartheid-state-policy",
  "1961-berlin-wall-construction",
  "1965-indonesia-mass-killings-suharto",
  "1968-prague-spring-invasion",
  "1973-chile-coup-pinochet",
  "1975-khmer-rouge-rule",
  "1989-tiananmen-crackdown",
  "1992-bosnian-war-srebrenica",
  "1994-rwanda-genocide",
  "2011-syria-war-displacement-assad-fall",
  "2021-taliban-kabul-takeover",
]);

// Chemistry includes materials science, semiconductors,
// electrochemistry, polymers, and material structures.
// The existing visual ID matter-material is retained until
// the Lucide migration (atom / box).
const MATTER_CHEMISTRY_IDS = new Set([
  "1556-agricola-de-re-metallica",
  "1774-priestley-oxygen",
  "1789-lavoisier-elementary-chemistry",
  "1799-proust-definite-proportions",
  "1800-voltaic-pile",
  "1803-dalton-atomic-theory",
  "1808-gay-lussac-combining-volumes",
  "1811-berzelius-chemical-symbols",
  "1828-wohler-urea-synthesis",
  "1833-faraday-electrolysis-laws",
  "1840-hess-law",
  "1856-bessemer-steel-process",
  "1861-butlerov-chemical-structure",
  "1865-kekule-benzene-ring",
  "1869-mendeleev-periodic-system",
  "1874-vant-hoff-le-bel-stereochemistry",
  "1884-le-chatelier-principle",
  "1884-arrhenius-electrolytic-dissociation",
  "1887-raoult-law",
  "1887-ostwald-physical-chemistry",
  "1893-werner-coordination-theory",
  "1894-ramsay-noble-gases",
  "1900-grignard-reagent",
  "1907-bakelite",
  "1913-bragg-xray-crystallography",
  "1916-lewis-electron-pair-bond",
  "1920-macromolecule-to-nylon",
  "1923-bronsted-lowry-acid-base",
  "1939-pauling-chemical-bond",
  "1947-transistor",
  "1953-1955-ziegler-natta-polymerization",
  "1960-mosfet-demonstration",
  "1965-1ry0uei",
  "1980-noyori-binap",
  "1985-lithium-ion-battery",
  "1985-buckminsterfullerene-c60",
  "1986-high-tc-superconductivity",
  "1987-nand-flash",
  "1989-1993-blue-led-gan",
  "1991-iijima-carbon-nanotubes",
  "2004-graphene-isolation",
]);

const LIFE_HEALTH_IDS = new Set([
  "1796-jenner-smallpox-vaccination",
  "1846-ether-anesthesia-demonstration",
  "1847-semmelweis-handwashing",
  "1854-john-snow-cholera",
  "1882-1eoddmg",
  "1908-water-chlorination",
  "1918-influenza-pandemic",
  "1922-first-insulin-patient",
  "1928-v3n6qx",
  "1954-lucky-dragon-no5",
  "1956-minamata-official-recognition",
  "1960-oral-contraceptive-approval",
  "1961-universal-health-pension",
  "1978-first-ivf-birth",
  "1980-smallpox-eradication",
  "1981-first-aids-report",
  "1986-163vwou",
  "1999-17pr3hn",
  "2011-au3xzt",
  "2020-13ara66",
  "2020-mrna-vaccine-first-approval",
]);

function eventSubs(event) {
  if (Array.isArray(event?.subs)) {
    return event.subs;
  }

  if (typeof event?.subs === "string") {
    return event.subs
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function fallbackIcon(primary) {
  const name = `fallback-${primary}`;

  return PUBLIC_EVENT_ICON_NAMES.has(name)
    ? name
    : "fallback-work";
}

function hasJapan(event) {
  return String(event?.region ?? "").includes("日本");
}

// Safari visual audit 2026-11-15: representative icons only.
// Classification tags and frozen priority are unchanged.
export const SAFARI_EVENT_ICON_OVERRIDES = Object.freeze({
  "1947-atomic-bomb-literature": "literature-japan",
  "1952-o1u4fc": "literature-japan",
  "1952-1nyn8rb": "literature-japan",
  "1975-18tui2v": "literature-japan",
  "1994-okuizumi-ishi-no-raireki": "literature-japan",
  "2017-wakatake-orabora": "literature-japan",
  "2020-usami-oshi-moyu": "literature-japan",
  "1961-fanon-wretched-earth": "colonialism",
  "1962-campbells-soup-cans": "art",
  "1973-enter-the-dragon": "visual-work",
  "1958-integrated-circuit": "fallback-computer",
  "1959-cobol-early-draft": "fallback-computer",
  "1964-ibm-system360": "fallback-computer",
  "1965-moores-law": "fallback-computer",
  "1970-intel-1103-dram": "fallback-computer",
  "1975-altair-8800": "fallback-computer",
  "1977-apple-ii": "fallback-computer",
  "1981-ibm-pc": "fallback-computer",
  "1982-nec-pc-9801": "fallback-computer",
  "2007-android-announcement": "fallback-computer",
  "1942-chicago-pile-1": "technology-innovation",
});

// Thought audit 2026-11-15, batch 1.
// Newer display decisions supersede historical L1 icons.
export const THOUGHT_EVENT_ICON_OVERRIDES = Object.freeze({
  "1508-michelangelo-sistine-ceiling": "art",
  "1657-comenius-didactica-magna": "fallback-education",
  "1662-17ugskf": "fallback-education",
  "1713-1f692r9": "life-health",
  "1748-spirit-of-laws": "law",
  "1762-rousseau-emile": "fallback-education",
  "1792-wollstonecraft-rights-woman": "gender",
  "1890-imperial-rescript-education": "fallback-education",
  "1906-duhem-physical-theory": "fallback-science",
  "1936-piaget-origins-intelligence": "fallback-science",
});

// Thought, unrest and industry audit 2026-11-15, batch 2.
// Newer display decisions; historical overrides remain intact.
export const THOUGHT_BATCH2_ICON_OVERRIDES = Object.freeze({
  "1946-17jncbd": "literature-japan",
  "1950-turing-computing-machinery-intelligence": "fallback-computer",
  "1965-lengrand-lifelong-education-working-paper": "fallback-education",
  "1971-illich-deschooling-society": "fallback-education",
  "1980-papert-mindstorms-book": "fallback-computer",
  "1983-gnu-announcement": "fallback-computer",
  "1989-crenshaw-intersection-race-sex": "gender",
  "1933-holocaust": "rights-suppress",
  "1943-colossus-computer": "technology-innovation",
  "1979-three-mile-island": "environment",
});

// Thought and rights audit, 2026-11-15.
// New decisions supersede older visual audits.
export const THOUGHT_RIGHTS_EVENT_ICON_OVERRIDES = Object.freeze({
  "1919-dalton-school-parkhurst": "fallback-education",
  "1919-first-waldorf-school": "fallback-education",
  "1921-eight-educational-claims-conference": "fallback-education",
  "1936-1leh3e2": "art",
  "1941-national-school-order": "fallback-education",
  "1946-1n7mkvy": "rights-suppress",
  "1947-first-course-of-study": "fallback-education",
  "1950-pnuwfy": "fallback-education",
  "1970-bourdieu-passeron-reproduction": "fallback-education",
  "1923-4u55lg": "fallback-education",
  "1946-women-first-general-election": "gender",
  "1946-us-education-mission-report-japan": "fallback-education",
  "1949-1knpnjn": "fallback-education",
  "1967-oshiro-cocktail-party": "literature-japan",
  "1968-freire-pedagogy-oppressed": "fallback-education",
  "1971-lee-kinuta-o-utsu-onna": "literature-japan",
  "1979-special-school-compulsory-education": "fallback-education",
  "1999-6oyqwx": "literature-world",
  "2004-opk6wy": "literature-world",
  "2016-educational-opportunity-act-japan": "fallback-education",
  "2017-metoo-global": "gender",
});

// Law to education representative icon audit, 2026-11-15.
// Preserve law subs and historical L2 decisions.
export const LAW_EDUCATION_EVENT_ICON_OVERRIDES = Object.freeze({
  "1903-national-textbooks-primary-japan": "fallback-education",
  "1908-six-year-compulsory-education": "fallback-education",
  "1918-xmrh5b": "fallback-education",
  "1935-147fdzs": "fallback-education",
  "1943-national-normal-schools": "fallback-education",
  "1947-b8zdub": "fallback-education",
  "1948-diet-resolutions-imperial-rescript-education": "fallback-education",
  "1956-local-education-administration-law": "fallback-education",
  "1991-university-standards-deregulation": "fallback-education",
  "2002-1wi6yqe": "fallback-education",
  "2004-national-university-corporations": "fallback-education",
  "2006-basic-act-education-revision": "fallback-education",
  "2022-teacher-license-renewal-abolished": "fallback-education",
});

// Teacher license renewal introduction, 2009-04-01.
// Preserve law classification; display as education history.
export const TEACHER_LICENSE_RENEWAL_EVENT_ICON_OVERRIDES = Object.freeze({
  "2009-teacher-license-renewal-introduced": "fallback-education",
});

// Politics and economy display audit, 2026-11-15.
// New display decisions supersede historical audits.
// SQL is handled by its subs change, not an icon override.
export const POLITICS_ECONOMY_EVENT_ICON_OVERRIDES = Object.freeze({
  "1901-australian-federation": "colonialism",
  "1904-weber-protestant-ethic": "thought",
  "1947-india-pakistan-partition": "politics-world",
  "1950-n44pj0": "fallback-education",
  "1957-ghana-independence": "colonialism",
  "1960-decolonization-declaration": "colonialism",
  "1963-oau-founded": "colonialism",
  "1969-ccs3ep": "economy",
  "1973-chile-coup-pinochet": "rights-suppress",
  "1973-university-of-tsukuba-opens": "fallback-education",
  "1975-png-independence": "colonialism",
  "1981-tanaka-nantonaku-crystal": "literature-japan",
  "1984-ad-hoc-council-education": "fallback-education",
  "1987-kcv3fe": "fallback-computer",
  "1990-jpop-cd-market": "music",
  "2000-8guh0p": "economy",
  "2001-china-wto-accession": "economy",
  "2004-sob65j": "economy",
  "2007-national-achievement-survey-japan": "fallback-education",
  "2008-spotify-launch": "music",
  "2016-brexit-referendum": "politics-world",
});

// Literature review, 2026-11-15.
// Three representative display overrides.
// Historical audit definitions remain unchanged.
export const LITERATURE_EVENT_ICON_OVERRIDES = Object.freeze({
  "1516-more-utopia": "literature-world",
  "1580-montaigne-essays": "literature-world",
  "1934-night-galactic-railroad": "literature-japan",
});

// Music classification and icon audit, 2026-11-15.
// Preserve older L1/L2 and politics/economy audit records.
export const MUSIC_EVENT_ICON_OVERRIDES = Object.freeze({
  "1956-illiac-music-i": "fallback-computer",
  "1964-moog-synthesizer": "technology-implementation",
  "1980-roland-tr808": "technology-implementation",
  "2008-spotify-launch": "media",
});

export function resolvePublicEventIcon(event) {
  const subs = eventSubs(event);

  if (Object.hasOwn(MUSIC_EVENT_ICON_OVERRIDES, event?.id)) {
    return MUSIC_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(LITERATURE_EVENT_ICON_OVERRIDES, event?.id)) {
    return LITERATURE_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(POLITICS_ECONOMY_EVENT_ICON_OVERRIDES, event?.id)) {
    return POLITICS_ECONOMY_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(TEACHER_LICENSE_RENEWAL_EVENT_ICON_OVERRIDES, event?.id)) {
    return TEACHER_LICENSE_RENEWAL_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(LAW_EDUCATION_EVENT_ICON_OVERRIDES, event?.id)) {
    return LAW_EDUCATION_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(THOUGHT_RIGHTS_EVENT_ICON_OVERRIDES, event?.id)) {
    return THOUGHT_RIGHTS_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(THOUGHT_EVENT_ICON_OVERRIDES, event?.id)) {
    return THOUGHT_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(THOUGHT_BATCH2_ICON_OVERRIDES, event?.id)) {
    return THOUGHT_BATCH2_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(SAFARI_EVENT_ICON_OVERRIDES, event?.id)) {
    return SAFARI_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(L1_EVENT_ICON_OVERRIDES, event?.id)) {
    return L1_EVENT_ICON_OVERRIDES[event.id];
  }

  if (Object.hasOwn(L3_EVENT_ICON_OVERRIDES, event?.id)) {
    return L3_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "work" &&
    Object.hasOwn(L2_WORK_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_WORK_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "science" &&
    Object.hasOwn(L2_SCIENCE_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_SCIENCE_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "society" &&
    Object.hasOwn(L2_SOCIETY_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_SOCIETY_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "culture" &&
    Object.hasOwn(L2_CULTURE_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_CULTURE_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "education" &&
    Object.hasOwn(L2_EDUCATION_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_EDUCATION_EVENT_ICON_OVERRIDES[event.id];
  }

  if (
    event?.primary === "computer" &&
    Object.hasOwn(L2_COMPUTER_EVENT_ICON_OVERRIDES, event?.id)
  ) {
    return L2_COMPUTER_EVENT_ICON_OVERRIDES[event.id];
  }

  const selectedSub = SUB_ICON_PRIORITY.find(
    (sub) => subs.includes(sub)
  );

  if (!selectedSub) {
    return fallbackIcon(event?.primary);
  }

  switch (selectedSub) {
    case "politics":
      return hasJapan(event)
        ? "politics-japan"
        : "politics-world";

    case "literature":
      return hasJapan(event)
        ? "literature-japan"
        : "literature-world";

    case "rights":
      return RIGHTS_SUPPRESS_IDS.has(event?.id)
        ? "rights-suppress"
        : "rights-expand";

    case "technology":
      return event?.primary === "science"
        ? "technology-innovation"
        : "technology-implementation";

    case "matter":
      return MATTER_CHEMISTRY_IDS.has(event?.id)
        ? "matter-material"
        : "matter-physics";

    case "visual":
      return event?.primary === "computer"
        ? "visual-media"
        : "visual-work";

    case "biomed":
      return LIFE_HEALTH_IDS.has(event?.id)
        ? "life-health"
        : "life-science";

    case "transport":
      return Object.hasOwn(TRANSPORT_MODE_ICON_BY_ID, event?.id)
        ? TRANSPORT_MODE_ICON_BY_ID[event.id]
        : "transport";

    case "life":
      return "fallback-culture";

    default:
      return selectedSub;
  }
}
