import { useState, useRef } from 'react'
import PokemonCard from './PokemonCard'
import CardForm from './CardForm'
import DownloadButton from './DownloadButton'
import { useLanguage } from '../contexts/useLanguage'
import './PokemonCardGenerator.css'

// メインのポケモンカードジェネレーターコンポーネント
const PokemonCardGenerator = () => {
  const { t } = useLanguage() // 翻訳機能とユーザーの言語設定を取得
  
  // カードデータの状態管理 - 初期値は言語に応じて設定
  const [cardData, setCardData] = useState({
    name: t('defaultCard.name'),
    hp: '100',
    type: 'normal',
    image: null,
    abilities: [
      { name: t('defaultCard.ability'), description: t('defaultCard.abilityDescription') }
    ],
    description: t('defaultCard.description')
  })

  const [imagePreview, setImagePreview] = useState(null)
  const cardRef = useRef(null)

  // サンプルカードのデータ - 現在の言語に基づいて動的に取得
  const getSampleCards = () => {
    const sampleData = t('sampleCards')
    return [
      {
        name: sampleData.blazemon.name,
        hp: '120',
        type: 'fire',
        abilities: sampleData.blazemon.abilities,
        description: sampleData.blazemon.description
      },
      {
        name: sampleData.aquaflow.name,
        hp: '90',
        type: 'water',
        abilities: sampleData.aquaflow.abilities,
        description: sampleData.aquaflow.description
      },
      {
        name: sampleData.thunderstrike.name,
        hp: '110',
        type: 'electric',
        abilities: sampleData.thunderstrike.abilities,
        description: sampleData.thunderstrike.description
      }
    ]
  }

  // 画像アップロード処理
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setCardData(prev => ({ ...prev, image: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // 入力フィールドの値変更処理
  const handleInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  // 技（アビリティ）の変更処理
  const handleAbilityChange = (index, field, value) => {
    const newAbilities = [...cardData.abilities]
    newAbilities[index] = { ...newAbilities[index], [field]: value }
    setCardData(prev => ({ ...prev, abilities: newAbilities }))
  }

  // 技の追加処理（最大3つまで）
  const addAbility = () => {
    if (cardData.abilities.length < 3) {
      setCardData(prev => ({
        ...prev,
        abilities: [...prev.abilities, { name: '', description: '' }]
      }))
    }
  }

  // 技の削除処理（最低1つは残す）
  const removeAbility = (index) => {
    if (cardData.abilities.length > 1) {
      const newAbilities = cardData.abilities.filter((_, i) => i !== index)
      setCardData(prev => ({ ...prev, abilities: newAbilities }))
    }
  }

  // サンプルカードの読み込み処理
  const loadSampleCard = (sample) => {
    setCardData({ ...sample, image: null })
    setImagePreview(null)
  }

  // カードリセット処理 - 言語に応じたデフォルト値に戻す
  const resetCard = () => {
    setCardData({
      name: t('defaultCard.name'),
      hp: '100',
      type: 'normal',
      image: null,
      abilities: [
        { name: t('defaultCard.ability'), description: t('defaultCard.abilityDescription') }
      ],
      description: t('defaultCard.description')
    })
    setImagePreview(null)
  }

  const sampleCards = getSampleCards()

  return (
    <div className="card-generator">
      <div className="generator-layout">
        {/* 左側：フォームセクション */}
        <div className="form-section">
          <h2>{t('cardCustomization')}</h2>
          
          {/* サンプルカードセクション */}
          <div className="samples-section">
            <h3>{t('trySampleCards')}</h3>
            <div className="sample-buttons">
              {sampleCards.map((sample, index) => (
                <button
                  key={index}
                  className="sample-button"
                  onClick={() => loadSampleCard(sample)}
                >
                  {sample.name}
                </button>
              ))}
              <button
                className="sample-button reset"
                onClick={resetCard}
              >
                {t('reset')}
              </button>
            </div>
          </div>

          {/* カード入力フォーム */}
          <CardForm
            cardData={cardData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onAbilityChange={handleAbilityChange}
            onAddAbility={addAbility}
            onRemoveAbility={removeAbility}
          />
        </div>
        
        {/* 右側：プレビューセクション */}
        <div className="preview-section">
          <h2>{t('cardPreview')}</h2>
          <div className="card-preview">
            <PokemonCard 
              ref={cardRef}
              cardData={cardData}
              imagePreview={imagePreview}
            />
          </div>
          {/* ダウンロードボタン */}
          <DownloadButton cardRef={cardRef} cardData={cardData} />
        </div>
      </div>
    </div>
  )
}

export default PokemonCardGenerator