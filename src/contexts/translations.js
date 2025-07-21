// 翻訳データ - 英語と日本語の対応表
export const translations = {
  en: {
    // ヘッダー部分
    appTitle: 'Pokemon Card Generator',
    appSubtitle: 'Create your own custom Pokemon-style cards!',
    builtWith: 'Built with',
    gplLicense: '(GPL-3.0)',
    licenseNotice: 'GPL-3.0 Licensed',
    
    // メインセクション
    cardCustomization: 'Card Customization',
    cardPreview: 'Card Preview',
    
    // サンプルカード
    trySampleCards: 'Try Sample Cards',
    blazemon: 'Blazemon',
    aquaflow: 'Aquaflow',
    thunderstrike: 'Thunderstrike',
    reset: 'Reset',
    
    // フォームラベル
    pokemonName: 'Pokemon Name',
    hp: 'HP',
    type: 'Type',
    pokemonImage: 'Pokemon Image',
    abilities: 'Abilities',
    description: 'Description',
    
    // フォームプレースホルダー
    enterPokemonName: 'Enter Pokemon name',
    abilityName: 'Ability name',
    abilityDescription: 'Ability description',
    pokemonDescriptionPlaceholder: 'A brief description of your Pokemon',
    
    // ボタンテキスト
    uploadImage: 'Upload Image',
    changeImage: 'Change Image',
    addAbility: '+ Add Ability',
    downloadCard: '📥 Download Card',
    generating: 'Generating...',
    
    // 情報テキスト
    recommendedImage: 'Recommended: Square images work best',
    downloadInfo: 'Downloads as PNG image (660×921px)',
    
    // ポケモンタイプ
    types: {
      normal: 'Normal',
      fire: 'Fire',
      water: 'Water',
      electric: 'Electric',
      grass: 'Grass',
      ice: 'Ice',
      fighting: 'Fighting',
      poison: 'Poison',
      ground: 'Ground',
      flying: 'Flying',
      psychic: 'Psychic',
      bug: 'Bug',
      rock: 'Rock',
      ghost: 'Ghost',
      dragon: 'Dragon',
      dark: 'Dark',
      steel: 'Steel',
      fairy: 'Fairy'
    },
    
    // サンプルカードデータ
    sampleCards: {
      blazemon: {
        name: 'Blazemon',
        abilities: [
          { name: 'Fire Blast', description: 'Deals massive fire damage to opponents.' },
          { name: 'Heat Wave', description: 'Burns all nearby enemies.' }
        ],
        description: 'A fierce fire-type Pokemon with incredible heat powers.'
      },
      aquaflow: {
        name: 'Aquaflow',
        abilities: [
          { name: 'Tidal Wave', description: 'Creates massive water attacks.' }
        ],
        description: 'A graceful water Pokemon that controls ocean currents.'
      },
      thunderstrike: {
        name: 'Thunderstrike',
        abilities: [
          { name: 'Lightning Bolt', description: 'Strikes with pure electric energy.' },
          { name: 'Static Shield', description: 'Creates protective electric barriers.' }
        ],
        description: 'An electric Pokemon crackling with storm energy.'
      }
    },
    
    // デフォルトカードデータ
    defaultCard: {
      name: 'Custom Pokemon',
      ability: 'Custom Ability',
      abilityDescription: 'Your custom ability description.',
      description: 'A unique and original Pokemon created by you!'
    },
    
    // アラートメッセージ
    alerts: {
      cardNotAvailable: 'Card preview not available',
      errorGenerating: 'Error generating card image. Please try again.'
    },
    
    // 言語切り替え
    language: 'Language',
    english: 'English',
    japanese: '日本語'
  },
  
  ja: {
    // ヘッダー部分
    appTitle: 'ポケモンカードジェネレーター',
    appSubtitle: 'オリジナルのポケモン風カードを作成しよう！',
    builtWith: '使用ライブラリ',
    gplLicense: '(GPL-3.0)',
    licenseNotice: 'GPL-3.0 ライセンス',
    
    // メインセクション
    cardCustomization: 'カードカスタマイズ',
    cardPreview: 'カードプレビュー',
    
    // サンプルカード
    trySampleCards: 'サンプルカードを試す',
    blazemon: 'ブレイズモン',
    aquaflow: 'アクアフロー',
    thunderstrike: 'サンダーストライク',
    reset: 'リセット',
    
    // フォームラベル
    pokemonName: 'ポケモン名',
    hp: 'HP',
    type: 'タイプ',
    pokemonImage: 'ポケモン画像',
    abilities: '技',
    description: '説明',
    
    // フォームプレースホルダー
    enterPokemonName: 'ポケモン名を入力',
    abilityName: '技名',
    abilityDescription: '技の説明',
    pokemonDescriptionPlaceholder: 'ポケモンの簡単な説明',
    
    // ボタンテキスト
    uploadImage: '画像をアップロード',
    changeImage: '画像を変更',
    addAbility: '+ 技を追加',
    downloadCard: '📥 カードをダウンロード',
    generating: '生成中...',
    
    // 情報テキスト
    recommendedImage: '推奨：正方形の画像が最適です',
    downloadInfo: 'PNG画像としてダウンロード (660×921px)',
    
    // ポケモンタイプ
    types: {
      normal: 'ノーマル',
      fire: 'ほのお',
      water: 'みず',
      electric: 'でんき',
      grass: 'くさ',
      ice: 'こおり',
      fighting: 'かくとう',
      poison: 'どく',
      ground: 'じめん',
      flying: 'ひこう',
      psychic: 'エスパー',
      bug: 'むし',
      rock: 'いわ',
      ghost: 'ゴースト',
      dragon: 'ドラゴン',
      dark: 'あく',
      steel: 'はがね',
      fairy: 'フェアリー'
    },
    
    // サンプルカードデータ
    sampleCards: {
      blazemon: {
        name: 'ブレイズモン',
        abilities: [
          { name: 'かえんほうしゃ', description: '敵に強力な炎ダメージを与える。' },
          { name: 'ねっぷう', description: '周囲の敵全てを火傷状態にする。' }
        ],
        description: '強力な炎の力を持つ激しい性格のポケモン。'
      },
      aquaflow: {
        name: 'アクアフロー',
        abilities: [
          { name: 'だいつなみ', description: '巨大な水の攻撃を繰り出す。' }
        ],
        description: '海流を操る優雅な水タイプのポケモン。'
      },
      thunderstrike: {
        name: 'サンダーストライク',
        abilities: [
          { name: 'かみなりボルト', description: '純粋な電気エネルギーで攻撃する。' },
          { name: 'でんきバリア', description: '防御用の電気バリアを作る。' }
        ],
        description: '嵐のエネルギーでパチパチと電気を放つポケモン。'
      }
    },
    
    // デフォルトカードデータ
    defaultCard: {
      name: 'カスタムポケモン',
      ability: 'カスタム技',
      abilityDescription: 'あなただけのオリジナル技の説明。',
      description: 'あなたが作った唯一無二のオリジナルポケモン！'
    },
    
    // アラートメッセージ
    alerts: {
      cardNotAvailable: 'カードプレビューが利用できません',
      errorGenerating: 'カード画像の生成中にエラーが発生しました。もう一度お試しください。'
    },
    
    // 言語切り替え
    language: '言語',
    english: 'English',
    japanese: '日本語'
  }
}