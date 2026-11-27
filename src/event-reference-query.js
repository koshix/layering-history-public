// 意味的に選定したWikipedia検索語。
// タイトル変更時は自動生成へ戻す。
const WIKIPEDIA_QUERY_OVERRIDES = new Map([
  ["1333-kt0o4a", ["建武の新政から室町幕府へ――朝廷と武家政権の関係を再編", "建武の新政"]],
  ["1350-t6aky0", ["前期倭寇の活動が顕著に――朝鮮沿岸の海域秩序と交易（1350年頃）", "倭寇"]],
  ["1542-new-laws-indies", ["インディアス新法からバリャドリード論争へ――先住民支配を再検討", "バリャドリッド論争"]],
  ["1545-potosi-silver", ["ポトシ銀山からマニラ・ガレオンへ――銀がつなぐ世界交易", "マニラ・ガレオン ポトシ"]],
  ["1558-shamisen-transmission", ["琉球の三線が本土へ伝わり三味線へ――近世邦楽を支える楽器が成立", "三味線"]],
  ["1630-hayashi-razan-shinobugaoka", ["林羅山の書院から昌平坂学問所へ、幕府の教学機関を形成", "昌平坂学問所"]],
  ["1727-1a1zmt8", ["ヨハン・ゼバスティアン・バッハ《マタイ受難曲》初演――宗教音楽とバロック表現を集大成", "マタイ受難曲"]],
  ["1728-punched-control-jacquard", ["ファルコンからジャカードへ――穿孔カードによる織機の自動制御", "ジャカード織機"]],
  ["1804-napoleonic-empire", ["ナポレオン帝政からナポレオン戦争終結へ――欧州秩序の再編", "ナポレオン戦争"]],
  ["1805-16vi2it", ["ルジャンドルからガウスへ――最小二乗法で観測データから値を推定する", "最小二乗法"]],
  ["1808-gay-lussac-combining-volumes", ["気体反応の体積比からアボガドロの分子仮説へ", "気体反応の法則 アボガドロの法則"]],
  ["1809-appert-canning", ["アペールの瓶詰保存から缶詰へ――食料を常温で長期保存する", "缶詰"]],
  ["1824-portland-cement-reinforced-concrete", ["ポルトランドセメントから鉄筋コンクリートへ――近代都市の骨格をつくる", "ポルトランドセメント 鉄筋コンクリート"]],
  ["1834-mechanical-refrigeration-cold-chain", ["機械冷凍から急速冷凍へ――食料の長期保存と広域流通", "冷凍"]],
  ["1837-babbage-analytical-engine", ["階差機関から解析機関へ――バベッジが自動計算を汎用プログラム可能機へ拡張", "解析機関"]],
  ["1842-fertilizer-industrialization", ["過リン酸石灰からハーバー・ボッシュへ――肥料を工業化", "肥料 ハーバー・ボッシュ法"]],
  ["1858-ansei-purge", ["安政の大獄から桜田門外の変へ――弾圧と反発による幕府権威の低下", "安政の大獄 桜田門外の変"]],
  ["1858-darwin-wallace-natural-selection", ["ダーウィンとウォレスの自然選択説――生物進化の仕組みを説明し『種の起源』へ", "自然選択"]],
  ["1859-drake-spindletop-petroleum", ["ドレーク井からスピンドルトップへ――石油が産業基盤になる", "石油産業"]],
  ["1861-arts-crafts-morris", ["モリスの工房からArts and Crafts展へ――工芸と産業化を問い直す", "アーツ・アンド・クラフツ運動"]],
  ["1861-italian-unification", ["イタリア王国成立からローマ併合へ――イタリア統一", "イタリア統一"]],
  ["1863-emancipation-proclamation", ["奴隷解放宣言から憲法修正第13条へ――米国奴隷制廃止", "奴隷解放宣言 アメリカ合衆国憲法修正第13条"]],
  ["1865-mendel-inheritance-laws", ["メンデルの遺伝法則から1900年の再発見へ――近代遺伝学の成立", "メンデルの法則"]],
  ["1871-fisk-jubilee-singers", ["フィスク・ジュビリー・シンガーズが演奏旅行へ――黒人霊歌の保存と国際的普及", "フィスク・ジュビリー・シンガーズ"]],
  ["1871-german-empire", ["普仏戦争からドイツ帝国成立へ――ドイツ統一", "ドイツ統一"]],
  ["1872-japan-town-gas-lng", ["横浜ガス灯からLNGへ――都市ガスが家庭エネルギー網になる", "都市ガス"]],
  ["1874-general-postal-union", ["ベルン条約で国際郵便を一つの制度へ――万国郵便連合の起点", "万国郵便連合"]],
  ["1875-1emr89y", ["メートル法からSIへ――測定を世界共通にする", "国際単位系"]],
  ["1879-wundt-experimental-psychology", ["ヴントがライプツィヒに実験心理学研究所を設け、心理学を実験科学へ", "ヴィルヘルム・ヴント 実験心理学"]],
  ["1881-1py4u3m", ["近代上下水道から水道法・下水道法へ――都市衛生をインフラ化", "日本の水道 下水道"]],
  ["1882-1eoddmg", ["コッホが結核菌を病原体として発表――結核の細菌学的理解へ", "結核菌 ロベルト・コッホ"]],
  ["1883-standard-time-prime-meridian", ["鉄道標準時からグリニッジ本初子午線へ――世界の時間を共通座標化", "標準時 グリニッジ子午線"]],
  ["1887-1w6fw9z", ["東京電燈から九電力体制へ――電気が日本の基幹インフラになる", "日本の電力会社"]],
  ["1889-kitasato-tetanus-serum", ["北里柴三郎の破傷風菌純粋培養から血清療法へ", "北里柴三郎 血清療法"]],
  ["1894-ramsay-noble-gases", ["ラムゼーらがアルゴンから希ガス族へ――周期表に新しい元素群を加える", "希ガス"]],
  ["1896-r903zn", ["放射能の発見からポロニウム・ラジウムへ――原子の内部構造を探る研究の端緒", "放射能"]],
  ["1903-pavlov-watson-behaviorism", ["パブロフの条件反射からワトソンの行動主義へ――行動を客観的に研究", "行動主義"]],
  ["1904-mitsukoshi-department-store", ["三越から阪急へ――百貨店と都市消費文化の形成", "日本の百貨店"]],
  ["1905-first-russian-revolution", ["血の日曜日からロシア第一革命へ――請願行進への発砲で抗議拡大", "ロシア第一革命"]],
  ["1908-hardy-weinberg-equilibrium", ["ワインベルグが平衡原理を発表、ハーディも独立に定式化――集団遺伝学の基準線", "ハーディー・ワインベルクの法則"]],
  ["1910-1936-earth-interior-seismology", ["地震波からモホ面・核境界・内核へ――地球内部の層構造を解明", "地球の内部構造"]],
  ["1911-1925-hr-diagram-payne", ["ヘルツシュプルング＝ラッセル図からペインへ――恒星を温度・光度・組成で読む", "HR図"]],
  ["1913-12-moseley-atomic-number", ["モーズリーがX線スペクトルから原子番号を物理量へ――周期表を核電荷で理解する", "モーズリーの法則"]],
  ["1920-macromolecule-to-nylon", ["高分子説の提唱からナイロンの合成へ", "高分子"]],
  ["1925-4x0uwm", ["行列力学・波動力学から不確定性原理へ――量子力学の成立", "量子力学"]],
  ["1927-lemaitre-expanding-universe", ["ルメートルからハッブルへ――膨張宇宙の理論と観測", "宇宙膨張"]],
  ["1928-dirac-electron-theory", ["ディラック方程式から陽電子発見へ――反粒子の予言と発見", "ディラック方程式 陽電子"]],
  ["1928-v3n6qx", ["ペニシリンからストレプトマイシンへ――抗生物質時代の成立", "抗生物質"]],
  ["1929-treachery-of-images", ["マグリットからダリへ――シュルレアリスムのイメージ世界", "シュルレアリスム"]],
  ["1943-colossus-computer", ["Colossusが完成し暗号解読の実運用へ――専用電子式デジタル計算機の実用化", "Colossus"]],
  ["1943-green-revolution-foundations", ["メキシコ農業計画から高収量品種IR8へ――緑の革命による食料増産の基盤", "緑の革命"]],
  ["1944-game-theory-nash", ["フォン・ノイマン＝モルゲンシュテルンからナッシュへ――ゲーム理論の成立", "ゲーム理論"]],
  ["1945-indonesian-independence-revolution", ["インドネシア独立宣言から独立革命・主権移譲へ", "インドネシア独立戦争"]],
  ["1948-paralympic-movement", ["ストーク・マンデビル競技会から第1回パラリンピックへ――障害者スポーツの国際大会化", "パラリンピック"]],
  ["1948-puig8r", ["母子手帳から母子健康手帳へ、母子保健を継続記録", "母子健康手帳"]],
  ["1949-1kh2d4h", ["国共内戦から中華人民共和国成立へ――中国革命", "国共内戦"]],
  ["1952-siifoq", ["電電公社から積滞解消へ、固定電話が家庭インフラになる", "日本電信電話公社"]],
  ["1953-1970-metropolis-hastings-mcmc", ["メトロポリスからヘイスティングスへ――MCMCで確率分布を計算する", "メトロポリス・ヘイスティングス法"]],
  ["1954-godzilla-film", ["映画『ゴジラ』公開――核の恐怖を怪獣映画へ", "ゴジラ 1954年の映画"]],
  ["1954-solar-wind-renewables", ["シリコン太陽電池からドイツの再生可能エネルギー法へ――再生可能電力の普及", "再生可能エネルギー"]],
  ["1954-traditional-crafts-exhibition-intangible", ["日本伝統工芸展から重要無形文化財指定へ――「わざ」を継承する制度を整える", "日本伝統工芸展 重要無形文化財"]],
  ["1955-birth-of-rock-and-roll", ["ロックンロールが主流市場へ――若者文化とポピュラー音楽を変える", "ロックンロール"]],
  ["1955-cesium-atomic-clock", ["セシウム原子時計からSI秒・UTCへ――時刻を原子で刻む", "原子時計"]],
  ["1957-1goasje", ["ダイエーからスーパーのチェーン化へ、大量販売が日常の買物を変える", "ダイエー スーパーマーケット"]],
  ["1958-5d0cnk", ["スバル360からカローラへ、マイカー社会が立ち上がる", "日本の自動車 モータリゼーション"]],
  ["1958-chicken-ramen", ["チキンラーメンからカップヌードルへ――即席麺の保存・調理・携帯性を革新", "インスタントラーメン"]],
  ["1958-x3ve0g", ["ウィンドクーラーからルームエアコンへ、室温を家電で制御", "エア・コンディショナー"]],
  ["1960-t8m1mf", ["道路交通法から交通安全対策基本法へ、「交通戦争」に制度対応", "道路交通法 交通安全対策基本法"]],
  ["1961-10fhylf", ["CTSSからVM/370へ、一台の大型計算機を共有・仮想化", "CTSS VM/370"]],
  ["1961-1c2uy15", ["JCB発足、汎用クレジットカードと口座振替を導入", "ジェーシービー"]],
  ["1962-atg-art-theatre-guild", ["ATG活動開始から映画製作へ――独立映画の回路を開く", "日本アート・シアター・ギルド"]],
  ["1963-1dgar7d", ["名神から東名へ、高速道路時代が始まる", "名神高速道路 東名高速道路"]],
  ["1963-ascii-standard", ["ASCIIが米国標準に――異なる計算機間の文字データ交換を共通化", "ASCII"]],
  ["1964-1xcgo2c", ["東京五輪からコールドチェーンへ、冷凍食品が家庭と外食へ", "コールドチェーン"]],
  ["1964-us-civil-voting-rights", ["公民権法から投票権法へ――米国公民権立法の転換", "公民権運動"]],
  ["1964-us-vietnam-escalation", ["トンキン湾決議から米軍地上部隊投入へ――ベトナム戦争への米国介入が本格化", "ベトナム戦争"]],
  ["1967-13btedu", ["公害対策基本法から公害国会へ、経済優先から規制強化へ", "公害対策基本法 公害国会"]],
  ["1967-standard-model-established", ["電弱理論からQCDへ――電弱相互作用と強い相互作用を記述する標準模型の成立", "標準模型"]],
  ["1968-vpfz4k", ["ポケットベルからPHSへ、個人通信が若者の日常になる", "ポケットベル PHS"]],
  ["1969-ccs3ep", ["キャッシュディスペンサーからATMへ、窓口外の銀行取引が広がる", "現金自動預け払い機"]],
  ["1970-1h4rfm5", ["すかいらーくからマクドナルドへ、外食チェーンが日常化", "外食産業"]],
  ["1970-8rm6ex", ["心身障害者対策基本法から障害者基本法へ、総合施策と社会参加を法制化", "障害者基本法"]],
  ["1970-codd-relational-model", ["コッドからSQL標準へ――リレーショナル・データベースの成立", "関係データベース"]],
  ["1971-1972-np-completeness", ["クックからカープへ――NP完全性と多項式時間還元による計算問題の分類", "NP完全"]],
  ["1971-1976-kek-proton-synchrotron", ["高エネルギー物理学研究所設立から12 GeV PSへ――日本の加速器共同利用を本格化", "高エネルギー加速器研究機構"]],
  ["1972-nmviag", ["よど号ハイジャックからあさま山荘事件へ――新左翼党派の過激化", "新左翼 日本"]],
  ["1973-12u6mfs", ["電話ファクスからFネットへ――文書の遠隔伝送を日常業務へ", "ファクシミリ Fネット"]],
  ["1973-4960fh", ["老人医療費無料化から老人保健法へ、高齢社会の医療を再設計", "老人保健法"]],
  ["1973-mri-development", ["ラウターバーとマンスフィールドからMRIへ――磁気共鳴で人体を画像化", "核磁気共鳴画像法"]],
  ["1973-new-music-city-pop", ["ニューミュージックからシティポップへ――洋楽を日本の都市音楽へ再構成", "ニューミュージック シティ・ポップ"]],
  ["1974-molina-rowland-ozone", ["CFCによるオゾン層破壊予測から南極オゾンホール発見へ", "オゾン層の破壊"]],
  ["1974-tcp-ip", ["TCPの設計からARPANETのTCP/IP移行へ――異種ネットワーク接続の基盤を形成", "TCP/IP"]],
  ["1976-public-key-cryptography", ["ディフィー＝ヘルマンからRSAへ――秘密鍵の事前共有に依存しない暗号技術の成立", "公開鍵暗号"]],
  ["1976-punk-diy-ramones", ["RamonesからSex Pistolsへ――パンクとDIY文化が拡大", "パンク・ロック"]],
  ["1977-1xcpoja", ["100円均一から100円SHOPダイソーへ、単一価格小売がチェーン化", "100円ショップ"]],
  ["1977-trans-europe-express", ["KraftwerkからYMOへ――電子ポップの展開", "クラフトワーク イエロー・マジック・オーケストラ"]],
  ["1978-jw10", ["JW-10からRupoへ、日本語文書作成を電子化", "日本語ワードプロセッサ"]],
  ["1979-japan-car-phone", ["自動車電話から携帯電話へ、移動通信が個人の手元へ", "携帯電話"]],
  ["1981-first-aids-report", ["AIDSの最初の公表報告からHIV発見へ", "後天性免疫不全症候群"]],
  ["1981-h4ir7z", ["川久保玲・山本耀司がパリで発表、日本の前衛服飾が世界へ", "川久保玲 山本耀司"]],
  ["1983-2008-cern-sps-lhc", ["CERN SPSのW・Z発見からLHC始動へ――高エネルギー衝突実験を拡大", "欧州原子核研究機構 SPS LHC"]],
  ["1983-gnu-announcement", ["GNUからGPLへ――自由ソフトウェアを制度化", "GNU GPL"]],
  ["1985-42kkt0", ["T1100からDynaBookへ、パソコンが机を離れる", "東芝 ノートパソコン"]],
  ["1985-ntt-privatization", ["NTT発足から国鉄分割民営化へ――公企業民営化の時代", "民営化"]],
  ["1985-vkgzu4", ["労働者派遣法制定から対象原則自由化・製造業解禁へ", "労働者派遣法"]],
  ["1987-oxod7", ["労働基準法改正から週40時間制の全面実施へ", "労働基準法 労働時間"]],
  ["1988-morris-worm", ["モリスワームがインターネットで大規模障害――組織的なセキュリティ対応へ", "モリスワーム"]],
  ["1989-1993-blue-led-gan", ["赤﨑・天野・中村らがGaN青色LEDを実用域へ――白色LED照明への道を開く", "青色発光ダイオード"]],
  ["1989-www-proposal", ["WWWの提案から公開告知へ――分散情報をハイパーテキストで結ぶ", "World Wide Web"]],
  ["1990-jomtien-education-for-all", ["ジョムティエンからダカールへ――「万人のための教育」の世界目標化", "万人のための教育"]],
  ["1991-bubble-economy-peak", ["日本のバブル景気が後退局面へ――資産価格崩壊と長期停滞の転機", "バブル景気"]],
  ["1991-gsm-commercial", ["GSM商用開始（1991年）から初のSMS送信（1992年）へ――携帯通信のデジタル化", "GSM SMS"]],
  ["1991-python-public-release", ["Pythonを初めて一般公開――可読性と汎用性を重視するプログラミング言語", "Python"]],
  ["1992-jpeg-1-standard", ["JPEG画像圧縮方式が国際標準へ――デジタル写真の流通基盤を形成", "JPEG"]],
  ["1992-mpeg-audio-layer3", ["MP3からNapsterへ――音楽のデジタル流通", "MP3 Napster"]],
  ["1992-rio-earth-summit", ["リオ地球サミットから生物多様性条約発効へ――地球環境政策の制度化", "地球サミット 生物多様性条約"]],
  ["1994-1ws4rqu", ["ハートビル法からバリアフリー法へ、建物・交通・まちの障壁を減らす", "バリアフリー法"]],
  ["1995-java-public-demo", ["Java技術を初めて一般公開――異なる計算機環境で動くプログラムを目指す", "Java"]],
  ["1995-javascript-browser", ["JavaScriptがWebブラウザーに登場――Webページに動的な処理を導入", "JavaScript"]],
  ["1995-ms8hp6", ["容器包装リサイクル法から循環型社会へ、分別と再商品化を制度化", "容器包装リサイクル法"]],
  ["1995-tsfpxo", ["SSLからTLSへ、Web通信を暗号化して相手を認証する", "Transport Layer Security"]],
  ["1996-1fwxu42", ["Internet ArchiveからWayback Machineへ――消えるWebを保存", "インターネットアーカイブ"]],
  ["1996-pnnxl4", ["ICQからSkypeへ、ネットが即時会話と通話の回線になる", "インスタントメッセンジャー"]],
  ["1997-1drdem8", ["楽天市場からAmazon.co.jpへ、ネット通販が国内市場を形成", "電子商取引 日本"]],
  ["1998-1rqzo6z", ["Bluetooth SIGから市販機へ、身の回りの機器を無線接続", "Bluetooth"]],
  ["1998-open-source-osi", ["「open source」の名称採用からOSI設立へ――ライセンスを通じた自由な利用・改変・再配布", "Open Source Initiative"]],
  ["2000-flets-adsl", ["ADSLからFTTHへ、家庭のインターネットが常時・高速接続へ", "ADSL FTTH"]],
  ["2001-1gyq08w", ["9・11からタリバンのカブール再掌握へ――アフガニスタン戦争20年", "アフガニスタン紛争 2001年"]],
  ["2001-i9bsek", ["SuicaからPASMO相互利用へ、改札をIC化", "Suica PASMO"]],
  ["2001-ipod-announcement", ["iPodからiTunes Music Storeへ――携帯音楽と配信の結合", "iPod iTunes Store"]],
  ["2003-1jbhlyr", ["地上デジタル放送開始からアナログ放送終了へ――放送インフラのデジタル化", "日本の地上デジタルテレビ放送"]],
  ["2003-1v5qdjd", ["支援費制度から障害者総合支援法へ、措置から選択・地域生活へ", "障害者総合支援法"]],
  ["2004-graphene-isolation", ["ガイム、ノボセロフらがグラフェンを単離し電界効果を実証", "グラフェン"]],
  ["2004-sob65j", ["おサイフケータイからQR決済へ、携帯電話が財布になる", "モバイル決済"]],
  ["2005-11uldef", ["Google Mapsからスマホナビへ、地図がネットサービスになる", "Google マップ"]],
  ["2005-akb48-participatory-idol", ["AKB48劇場から選抜総選挙へ――ファン参加型アイドル文化を拡大", "AKB48"]],
  ["2006-1pgqppv", ["BigtableからDynamoへ、Web規模のデータを分散保存", "NoSQL"]],
  ["2007-1ebqvu6", ["iPhone発売から翌2008年のApp Storeへ――携帯端末をアプリのプラットフォームに", "iPhone App Store"]],
  ["2008-1a3sjxp", ["DropboxからiCloudへ、ファイルを持ち歩かず同期する", "オンラインストレージ"]],
  ["2008-mooc-formation", ["CCK08からCoursera・edXへ――MOOCの成立と大規模化", "MOOC"]],
  ["2010-bouazizi-protest", ["ブアジジの抗議からエジプト革命へ――アラブの春", "アラブの春"]],
  ["2011-15phg6o", ["障害者基本法改正から差別解消法へ、権利条約を国内制度へ", "障害者差別解消法"]],
  ["2013-docker-public-demo", ["DockerからKubernetesへ――コンテナによる実行環境の分離と運用管理", "Docker Kubernetes"]],
  ["2013-washoku-unesco", ["「和食」がUNESCO無形文化遺産へ――季節と年中行事を食文化として継承", "和食"]],
  ["2016-8oej6s", ["AlphaGoからAlphaGo Zeroへ――深層学習・探索・自己対局による囲碁AI", "AlphaGo"]],
  ["2019-1xfguac", ["WebAuthnからパスキーへ、ログインをパスワードから公開鍵へ", "WebAuthn パスキー"]],
  ["2024-reasoning-models-o1-deepseek-r1", ["o1からDeepSeek-R1へ――推論時の計算量を活用して性能を高める生成AI", "DeepSeek-R1"]],
]);

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
  eventId = ""
) {
  const source = cleanText(title);
  const fallback = cleanText(fallbackQuery);

  if (!source) return fallback;

  const override = WIKIPEDIA_QUERY_OVERRIDES.get(eventId);

  if (override && source === cleanText(override[0])) {
    return override[1];
  }

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
