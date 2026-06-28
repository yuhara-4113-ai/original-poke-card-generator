import { useRef } from 'react'
import { useLanguage } from '../contexts/useLanguage'

// カード入力フォームコンポーネント - 各入力項目を管理
const CardForm = ({ 
  cardData, 
  layoutMode,
  onLayoutModeChange,
  onInputChange, 
  onImageUpload, 
  onAbilityChange, 
  onAddAbility, 
  onRemoveAbility,
  imageError,
  imageAdjustment = { x: 0, y: 0, zoom: 1 },
  onImageAdjustment,
  onResetImageAdjustment,
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
      <fieldset className="form-group card-layout-group">
        <legend className="group-label">{t('cardLayout')}</legend>
        <div className="layout-options">
          <label className="layout-option">
            <input
              type="radio"
              name="card-layout"
              value="standard"
              checked={layoutMode === 'standard'}
              onChange={(event) => onLayoutModeChange(event.target.value)}
            />
            <span>
              <strong>{t('standardLayout')}</strong>
              <small>{t('standardLayoutDescription')}</small>
            </span>
          </label>
          <label className="layout-option">
            <input
              type="radio"
              name="card-layout"
              value="fullArt"
              checked={layoutMode === 'fullArt'}
              onChange={(event) => onLayoutModeChange(event.target.value)}
            />
            <span>
              <strong>{t('fullArtLayout')}</strong>
              <small>{t('fullArtLayoutDescription')}</small>
            </span>
          </label>
        </div>
      </fieldset>

      {/* ポケモン名入力 */}
      <div className="form-group pokemon-name-group">
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
      <div className="form-group image-upload-group">
        <span className="group-label">{t('pokemonImage')}</span>
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
            id="pokemon-image"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            hidden
          />
          <small>{t('recommendedImage')}</small>
          {imageError && (
            <div className="image-upload-error" role="alert">
              <span aria-hidden="true">!</span>
              {imageError}
            </div>
          )}
          {cardData.image && (
            <div className="image-adjustments">
              <div className="image-adjustments-heading">
                <strong>{t('imageAdjustment')}</strong>
                <button type="button" onClick={onResetImageAdjustment}>
                  {t('resetImageAdjustment')}
                </button>
              </div>
              <label htmlFor="image-position-x">
                <span>{t('imagePositionX')}</span>
                <input
                  id="image-position-x"
                  type="range"
                  min="-100"
                  max="100"
                  value={imageAdjustment.x}
                  onChange={(event) => onImageAdjustment('x', event.target.value)}
                />
              </label>
              <label htmlFor="image-position-y">
                <span>{t('imagePositionY')}</span>
                <input
                  id="image-position-y"
                  type="range"
                  min="-100"
                  max="100"
                  value={imageAdjustment.y}
                  onChange={(event) => onImageAdjustment('y', event.target.value)}
                />
              </label>
              <label htmlFor="image-zoom">
                <span>{t('imageZoom')}</span>
                <input
                  id="image-zoom"
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={imageAdjustment.zoom}
                  onChange={(event) => onImageAdjustment('zoom', event.target.value)}
                />
                <output htmlFor="image-zoom">{Math.round(imageAdjustment.zoom * 100)}%</output>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 技（アビリティ）セクション - エネルギーコストとダメージ対応 */}
      <div className="form-group abilities-form-group">
        <span className="group-label">{t('abilities')}</span>
        <div className="abilities-section">
          {cardData.abilities.map((ability, index) => (
            <div key={index} className="ability-group">
              <div className="ability-header">
                <input
                  aria-label={`${t('abilityName')} ${index + 1}`}
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
                    aria-label={`${t('removeAbility')} ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* エネルギーコストとダメージの入力行 */}
              <div className="ability-stats">
                <div className="energy-cost-group">
                  <label>{t('energyCost')}</label>
                  <select
                    aria-label={`${t('energyCost')} ${index + 1}`}
                    value={ability.energyCost || 1}
                    onChange={(e) => onAbilityChange(index, 'energyCost', parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(cost => (
                      <option key={cost} value={cost}>{cost}</option>
                    ))}
                  </select>
                </div>
                
                <div className="damage-group">
                  <label>{t('damage')}</label>
                  <input
                    aria-label={`${t('damage')} ${index + 1}`}
                    type="number"
                    value={ability.damage || ''}
                    onChange={(e) => onAbilityChange(index, 'damage', e.target.value)}
                    placeholder="30"
                    min="0"
                    max="999"
                  />
                </div>
              </div>
              
              <textarea
                aria-label={`${t('abilityDescription')} ${index + 1}`}
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

      {/* カード詳細情報セクション - にげるコスト */}
      <div className="form-group card-details-form-group">
        <span className="group-label">{t('cardDetails')}</span>
        <div className="card-details-section">
          <div className="detail-row">
            <div className="detail-group">
              <label>{t('retreatCost')}</label>
              <select
                aria-label={t('retreatCost')}
                value={cardData.retreatCost || 1}
                onChange={(e) => onInputChange('retreatCost', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map(cost => (
                  <option key={cost} value={cost}>{cost}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-group">
              <label>{t('cardNumber')}</label>
              <input
                aria-label={t('cardNumber')}
                type="text"
                value={cardData.cardNumber || '001/100'}
                onChange={(e) => onInputChange('cardNumber', e.target.value)}
                placeholder="001/100"
                maxLength={10}
              />
            </div>
            
            <div className="detail-group">
              <label>{t('rarity')}</label>
              <select
                aria-label={t('rarity')}
                value={cardData.rarity || 'common'}
                onChange={(e) => onInputChange('rarity', e.target.value)}
              >
                <option value="common">{t('rarities.common')}</option>
                <option value="uncommon">{t('rarities.uncommon')}</option>
                <option value="rare">{t('rarities.rare')}</option>
                <option value="holo">{t('rarities.holo')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ポケモンの説明入力 */}
      <div className="form-group description-form-group">
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
