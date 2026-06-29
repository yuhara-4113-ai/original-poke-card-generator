// 翻訳データ - 英語と日本語の対応表
export const translations = {
  en: {
    // ヘッダー部分
    appTitle: "Pokemon Card Generator",
    appSubtitle: "Create your own custom Pokemon-style cards!",
    stagingEnvironment: "Staging",
    builtWith: "Built with",
    gplLicense: "(GPL-3.0)",
    licenseNotice: "GPL-3.0 Licensed",
    fanDisclaimer:
      "Independent fan-made tool. Not affiliated with or endorsed by The Pokémon Company.",
    previewHint: "Move your pointer to see the foil",

    // メインセクション
    cardCustomization: "Card Customization",
    cardPreview: "Card Preview",

    // サンプルカード
    trySampleCards: "Try Sample Cards",
    blazemon: "Blazemon",
    aquaflow: "Aquaflow",
    thunderstrike: "Thunderstrike",
    reset: "Reset",

    // フォームラベル
    pokemonName: "Pokemon Name",
    cardLayout: "Card Layout",
    standardLayout: "Standard",
    standardLayoutDescription: "Artwork window with all card details",
    fullArtLayout: "Full Art",
    fullArtLayoutDescription: "Photo across the card with a premium zebra frame",
    hp: "HP",
    type: "Type",
    pokemonImage: "Pokemon Image",
    abilities: "Abilities",
    description: "Description",

    // 新しいフォームラベル - カード詳細
    energyCost: "Energy Cost",
    damage: "Damage",
    cardDetails: "Card Details",
    weakness: "Weakness",
    resistance: "Resistance",
    retreatCost: "Retreat Cost",
    cardNumber: "Card Number",
    rarity: "Rarity",
    none: "None",

    // レアリティ
    rarities: {
      common: "Common",
      uncommon: "Uncommon",
      rare: "Rare",
      holo: "Holographic",
    },

    // フォームプレースホルダー
    enterPokemonName: "Enter Pokemon name",
    abilityName: "Ability name",
    abilityDescription: "Ability description",
    pokemonDescriptionPlaceholder: "A brief description of your Pokemon",

    // ボタンテキスト
    uploadImage: "Upload Image",
    changeImage: "Change Image",
    imageAdjustment: "Image framing",
    imageZoom: "Zoom",
    directImageAdjustmentHelp: "Drag to reposition. Pinch with two fingers to zoom.",
    directImageAdjustmentLabel: "Drag to reposition the card image. Pinch to zoom, or use arrow keys for fine adjustments.",
    resetImageAdjustment: "Reset",
    addAbility: "+ Add Ability",
    removeAbility: "Remove ability",
    downloadCard: "Download high-resolution PNG",
    includeFoil: "Include foil effect in PNG",
    foilOn: "ON",
    foilOff: "OFF",
    generating: "Generating...",
    downloadSuccess: "Your PNG is ready.",

    // 情報テキスト
    recommendedImage:
      "JPG, PNG or WebP · up to 8 MB · portrait images work best",
    downloadInfo: "Exports the exact preview at 1320 × 1842 px",

    // ポケモンタイプ
    types: {
      normal: "Normal",
      fire: "Fire",
      water: "Water",
      electric: "Electric",
      grass: "Grass",
      ice: "Ice",
      fighting: "Fighting",
      poison: "Poison",
      ground: "Ground",
      flying: "Flying",
      psychic: "Psychic",
      bug: "Bug",
      rock: "Rock",
      ghost: "Ghost",
      dragon: "Dragon",
      dark: "Dark",
      steel: "Steel",
      fairy: "Fairy",
    },

    // サンプルカードデータ
    sampleCards: {
      blazemon: {
        name: "Blazemon",
        abilities: [
          {
            name: "Fire Blast",
            description: "Deals massive fire damage to opponents.",
          },
          { name: "Heat Wave", description: "Burns all nearby enemies." },
        ],
        description: "A fierce fire-type Pokemon with incredible heat powers.",
      },
      aquaflow: {
        name: "Aquaflow",
        abilities: [
          { name: "Tidal Wave", description: "Creates massive water attacks." },
        ],
        description: "A graceful water Pokemon that controls ocean currents.",
      },
      thunderstrike: {
        name: "Thunderstrike",
        abilities: [
          {
            name: "Lightning Bolt",
            description: "Strikes with pure electric energy.",
          },
          {
            name: "Static Shield",
            description: "Creates protective electric barriers.",
          },
        ],
        description: "An electric Pokemon crackling with storm energy.",
      },
    },

    // デフォルトカードデータ
    defaultCard: {
      name: "Custom Pokemon",
      ability: "Custom Ability",
      abilityDescription: "Your custom ability description.",
      description: "A unique and original Pokemon created by you!",
    },

    // アラートメッセージ
    alerts: {
      cardNotAvailable: "Card preview not available",
      errorGenerating: "Error generating card image. Please try again.",
      invalidImage: "Please choose a valid image file.",
      imageTooLarge: "Please choose an image smaller than 8 MB.",
    },

    // 言語切り替え
    language: "Language",
    english: "English",
    japanese: "日本語",
  },

  ja: {
    // ヘッダー部分
    appTitle: "ポケモンカードジェネレーター",
    appSubtitle: "オリジナルのポケモン風カードを作成しよう！",
    stagingEnvironment: "検証環境",
    builtWith: "使用ライブラリ",
    gplLicense: "(GPL-3.0)",
    licenseNotice: "GPL-3.0 ライセンス",
    fanDisclaimer:
      "非公式のファンメイドツールです。株式会社ポケモンおよび関連各社とは関係ありません。",
    previewHint: "カードを動かすと光沢が変化します",

    // メインセクション
    cardCustomization: "カードカスタマイズ",
    cardPreview: "カードプレビュー",

    // サンプルカード
    trySampleCards: "サンプルカードを試す",
    blazemon: "ブレイズモン",
    aquaflow: "アクアフロー",
    thunderstrike: "サンダーストライク",
    reset: "リセット",

    // フォームラベル
    pokemonName: "ポケモン名",
    cardLayout: "カードレイアウト",
    standardLayout: "通常",
    standardLayoutDescription: "画像枠とすべてのカード情報を表示",
    fullArtLayout: "全面アート",
    fullArtLayoutDescription: "カード全面に写真を表示する高級感のあるゼブラフレーム",
    hp: "HP",
    type: "タイプ",
    pokemonImage: "ポケモン画像",
    abilities: "技",
    description: "説明",

    // 新しいフォームラベル - カード詳細
    energyCost: "エネルギーコスト",
    damage: "ダメージ",
    cardDetails: "カード詳細",
    weakness: "弱点",
    resistance: "抵抗力",
    retreatCost: "にげるコスト",
    cardNumber: "カード番号",
    rarity: "レアリティ",
    none: "なし",

    // レアリティ
    rarities: {
      common: "コモン",
      uncommon: "アンコモン",
      rare: "レア",
      holo: "ホログラフィック",
    },

    // フォームプレースホルダー
    enterPokemonName: "ポケモン名を入力",
    abilityName: "技名",
    abilityDescription: "技の説明",
    pokemonDescriptionPlaceholder: "ポケモンの簡単な説明",

    // ボタンテキスト
    uploadImage: "画像をアップロード",
    changeImage: "画像を変更",
    imageAdjustment: "画像の表示調整",
    imageZoom: "拡大・縮小",
    directImageAdjustmentHelp: "ドラッグで位置を調整、2本指のピンチ操作で拡大・縮小できます。",
    directImageAdjustmentLabel: "ドラッグで画像の位置を調整します。ピンチで拡大・縮小、矢印キーで微調整できます。",
    resetImageAdjustment: "調整をリセット",
    addAbility: "+ 技を追加",
    removeAbility: "技を削除",
    downloadCard: "高解像度画像をダウンロード",
    includeFoil: "画像に光沢エフェクトを含める",
    foilOn: "ON",
    foilOff: "OFF",
    generating: "生成中...",
    downloadSuccess: "画像を保存しました。",

    // 情報テキスト
    recommendedImage: "JPG・PNG・WebP／8MBまで／縦長画像がおすすめです",
    downloadInfo: "プレビューと同じ内容を1320 × 1842 pxで保存します",

    // ポケモンタイプ
    types: {
      normal: "ノーマル",
      fire: "ほのお",
      water: "みず",
      electric: "でんき",
      grass: "くさ",
      ice: "こおり",
      fighting: "かくとう",
      poison: "どく",
      ground: "じめん",
      flying: "ひこう",
      psychic: "エスパー",
      bug: "むし",
      rock: "いわ",
      ghost: "ゴースト",
      dragon: "ドラゴン",
      dark: "あく",
      steel: "はがね",
      fairy: "フェアリー",
    },

    // サンプルカードデータ
    sampleCards: {
      blazemon: {
        name: "ブレイズモン",
        abilities: [
          {
            name: "かえんほうしゃ",
            description: "敵に強力な炎ダメージを与える。",
          },
          { name: "ねっぷう", description: "周囲の敵全てを火傷状態にする。" },
        ],
        description: "強力な炎の力を持つ激しい性格のポケモン。",
      },
      aquaflow: {
        name: "アクアフロー",
        abilities: [
          { name: "だいつなみ", description: "巨大な水の攻撃を繰り出す。" },
        ],
        description: "海流を操る優雅な水タイプのポケモン。",
      },
      thunderstrike: {
        name: "サンダーストライク",
        abilities: [
          {
            name: "かみなりボルト",
            description: "純粋な電気エネルギーで攻撃する。",
          },
          { name: "でんきバリア", description: "防御用の電気バリアを作る。" },
        ],
        description: "嵐のエネルギーでパチパチと電気を放つポケモン。",
      },
    },

    // デフォルトカードデータ
    defaultCard: {
      name: "カスタムポケモン",
      ability: "カスタム技",
      abilityDescription: "あなただけのオリジナル技の説明。",
      description: "あなたが作った唯一無二のオリジナルポケモン！",
    },

    // アラートメッセージ
    alerts: {
      cardNotAvailable: "カードプレビューが利用できません",
      errorGenerating:
        "カード画像の生成中にエラーが発生しました。もう一度お試しください。",
      invalidImage: "有効な画像ファイルを選択してください。",
      imageTooLarge: "8MB未満の画像を選択してください。",
    },

    // 言語切り替え
    language: "言語",
    english: "English",
    japanese: "日本語",
  },
};
