import { useRef } from 'react'
import { useLanguage } from '../contexts/useLanguage'

// カード入力フォームコンポーネント - 各入力項目を管理
const CardForm = ({ 
  cardData, 
  onInputChange, 
  onImageUpload, 
  onAbilityChange, 
  onAddAbility, 
  onRemoveAbility 
}) => {
  const fileInputRef = useRef(null)
  const { t } = useLanguage() // 翻訳機能を使用

  // ポケモンタイプの定義（翻訳対応）
  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  // 画像アップロードボタンのクリック処理
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="card-form">
      {/* ポケモン名入力 */}
      <div className="form-group">
        <label htmlFor="pokemon-name">{t('pokemonName')}</label>
        <input
          id="pokemon-name"
          type="text"
          value={cardData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder={t('enterPokemonName')}
          maxLength={20}
        />
      </div>

      {/* HP と タイプの横並び入力 */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pokemon-hp">{t('hp')}</label>
          <input
            id="pokemon-hp"
            type="number"
            value={cardData.hp}
            onChange={(e) => onInputChange('hp', e.target.value)}
            placeholder="100"
            min="10"
            max="999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pokemon-type">{t('type')}</label>
          <select
            id="pokemon-type"
            value={cardData.type}
            onChange={(e) => onInputChange('type', e.target.value)}
          >
            {pokemonTypes.map(type => (
              <option key={type} value={type}>
                {t(`types.${type}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 画像アップロードセクション */}
      <div className="form-group">
        <label>{t('pokemonImage')}</label>
        <div className="image-upload-section">
          <button
            type="button"
            className="image-upload-button"
            onClick={handleImageClick}
          >
            {cardData.image ? t('changeImage') : t('uploadImage')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            style={{ display: 'none' }}
          />
          <small>{t('recommendedImage')}</small>
        </div>
      </div>

      {/* 技（アビリティ）セクション */}
      <div className="form-group">
        <label>{t('abilities')}</label>
        <div className="abilities-section">
          {cardData.abilities.map((ability, index) => (
            <div key={index} className="ability-group">
              <div className="ability-header">
                <input
                  type="text"
                  value={ability.name}
                  onChange={(e) => onAbilityChange(index, 'name', e.target.value)}
                  placeholder={t('abilityName')}
                  maxLength={20}
                />
                {/* 技が複数ある場合は削除ボタンを表示 */}
                {cardData.abilities.length > 1 && (
                  <button
                    type="button"
                    className="remove-ability"
                    onClick={() => onRemoveAbility(index)}
                  >
                    ×
                  </button>
                )}
              </div>
              <textarea
                value={ability.description}
                onChange={(e) => onAbilityChange(index, 'description', e.target.value)}
                placeholder={t('abilityDescription')}
                maxLength={60}
                rows={2}
              />
            </div>
          ))}
          {/* 技の追加ボタン（最大3つまで） */}
          {cardData.abilities.length < 3 && (
            <button
              type="button"
              className="add-ability"
              onClick={onAddAbility}
            >
              {t('addAbility')}
            </button>
          )}
        </div>
      </div>

      {/* ポケモンの説明入力 */}
      <div className="form-group">
        <label htmlFor="pokemon-description">{t('description')}</label>
        <textarea
          id="pokemon-description"
          value={cardData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('pokemonDescriptionPlaceholder')}
          maxLength={100}
          rows={3}
        />
      </div>
    </div>
  )
}

export default CardForm