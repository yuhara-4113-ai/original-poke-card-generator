import { useState, useRef } from 'react'
import PokemonCard from './PokemonCard'
import CardForm from './CardForm'
import DownloadButton from './DownloadButton'
import { useLanguage } from '../contexts/useLanguage'
import './PokemonCardGenerator.css'

const initialImageAdjustment = {
  x: 0,
  y: 0,
  zoom: 1,
  width: 0,
  height: 0,
}

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
      { 
        name: t('defaultCard.ability'), 
        description: t('defaultCard.abilityDescription'),
        energyCost: 1,
        damage: ''
      }
    ],
    description: t('defaultCard.description'),
    weakness: 'none',
    resistance: 'none',
    retreatCost: 1,
    cardNumber: '001/100',
    rarity: 'common'
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [imageAdjustment, setImageAdjustment] = useState(initialImageAdjustment)
  const [layoutMode, setLayoutMode] = useState('standard')
  const [imageError, setImageError] = useState('')
  const cardRef = useRef(null)
  const imageUploadIdRef = useRef(0)

  // サンプルカードのデータ - 現在の言語に基づいて動的に取得
  const getSampleCards = () => {
    const sampleData = t('sampleCards')
    return [
      {
        name: sampleData.blazemon.name,
        hp: '120',
        type: 'fire',
        abilities: sampleData.blazemon.abilities.map(ability => ({
          ...ability,
          energyCost: 2,
          damage: '80'
        })),
        description: sampleData.blazemon.description,
        weakness: 'water',
        resistance: 'none',
        retreatCost: 2,
        cardNumber: '001/100',
        rarity: 'rare'
      },
      {
        name: sampleData.aquaflow.name,
        hp: '90',
        type: 'water',
        abilities: sampleData.aquaflow.abilities.map(ability => ({
          ...ability,
          energyCost: 1,
          damage: '60'
        })),
        description: sampleData.aquaflow.description,
        weakness: 'electric',
        resistance: 'fire',
        retreatCost: 1,
        cardNumber: '002/100',
        rarity: 'uncommon'
      },
      {
        name: sampleData.thunderstrike.name,
        hp: '110',
        type: 'electric',
        abilities: sampleData.thunderstrike.abilities.map(ability => ({
          ...ability,
          energyCost: 1,
          damage: '70'
        })),
        description: sampleData.thunderstrike.description,
        weakness: 'fighting',
        resistance: 'steel',
        retreatCost: 1,
        cardNumber: '003/100',
        rarity: 'holo'
      }
    ]
  }

  // 画像アップロード処理
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const uploadId = ++imageUploadIdRef.current
    if (!file.type.startsWith('image/')) {
      setImageError(t('alerts.invalidImage'))
      event.target.value = ''
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError(t('alerts.imageTooLarge'))
      event.target.value = ''
      return
    }

    setImageError('')
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      if (imageUploadIdRef.current !== uploadId) return
      const imageUrl = readerEvent.target.result
      const image = new Image()
      image.onload = () => {
        if (imageUploadIdRef.current !== uploadId) return
        setImagePreview(imageUrl)
        setImageAdjustment({
          ...initialImageAdjustment,
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
        setCardData(prev => ({ ...prev, image: imageUrl }))
      }
      image.onerror = () => {
        if (imageUploadIdRef.current !== uploadId) return
        setImageError(t('alerts.invalidImage'))
      }
      image.src = imageUrl
    }
    reader.onerror = () => {
      if (imageUploadIdRef.current !== uploadId) return
      setImageError(t('alerts.invalidImage'))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  // 入力フィールドの値変更処理
  const handleInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageAdjustment = (field, value) => {
    setImageAdjustment(prev => ({ ...prev, [field]: Number(value) }))
  }

  const handleImageAdjustmentChange = (changes) => {
    setImageAdjustment(prev => ({ ...prev, ...changes }))
  }

  const resetImageAdjustment = () => {
    setImageAdjustment(prev => ({
      ...initialImageAdjustment,
      width: prev.width,
      height: prev.height,
    }))
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
        abilities: [...prev.abilities, { name: '', description: '', energyCost: 1, damage: '' }]
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
    imageUploadIdRef.current += 1
    setCardData({ ...sample, image: null })
    setImagePreview(null)
    setImageAdjustment(initialImageAdjustment)
    setImageError('')
  }

  // カードリセット処理 - 言語に応じたデフォルト値に戻す
  const resetCard = () => {
    imageUploadIdRef.current += 1
    setCardData({
      name: t('defaultCard.name'),
      hp: '100',
      type: 'normal',
      image: null,
      abilities: [
        { 
          name: t('defaultCard.ability'), 
          description: t('defaultCard.abilityDescription'),
          energyCost: 1,
          damage: ''
        }
      ],
      description: t('defaultCard.description'),
      weakness: 'none',
      resistance: 'none',
      retreatCost: 1,
      cardNumber: '001/100',
      rarity: 'common'
    })
    setImagePreview(null)
    setImageAdjustment(initialImageAdjustment)
    setLayoutMode('standard')
    setImageError('')
  }

  const sampleCards = getSampleCards()

  return (
    <div className="card-generator">
      <div className="generator-layout">
        {/* 左側：フォームセクション */}
        <section className="form-section" aria-labelledby="customization-title">
          <div className="section-heading">
            <div>
              <span className="section-step">01 / Design</span>
              <h2 id="customization-title">{t('cardCustomization')}</h2>
            </div>
          </div>
          
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
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onAbilityChange={handleAbilityChange}
            onAddAbility={addAbility}
            onRemoveAbility={removeAbility}
            imageError={imageError}
            imageAdjustment={imageAdjustment}
            onImageAdjustment={handleImageAdjustment}
            onResetImageAdjustment={resetImageAdjustment}
          />
        </section>
        
        {/* 右側：プレビューセクション */}
        <section className="preview-section" aria-labelledby="preview-title">
          <div className="section-heading">
            <div>
              <span className="section-step">02 / Preview</span>
              <h2 id="preview-title">{t('cardPreview')}</h2>
            </div>
            <span className="preview-hint">{t('previewHint')}</span>
          </div>
          <div className="card-preview">
            <PokemonCard 
              ref={cardRef}
              cardData={cardData}
              layoutMode={layoutMode}
              imagePreview={imagePreview}
              imageAdjustment={imageAdjustment}
              imageDragLabel={t('directImageAdjustmentLabel')}
              onImageAdjustmentChange={handleImageAdjustmentChange}
            />
          </div>
          {/* ダウンロードボタン */}
          <DownloadButton cardRef={cardRef} cardData={cardData} />
        </section>
      </div>
    </div>
  )
}

export default PokemonCardGenerator
