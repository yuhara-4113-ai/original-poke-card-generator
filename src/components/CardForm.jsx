import { useRef } from 'react'
import { useLanguage } from '../contexts/useLanguage'

const INPUT_LIMITS = {
  pokemonName: 16,
  abilityName: 16,
  abilityDescription: 32,
  pokemonDescription: 100,
}

const CharacterCount = ({ currentLength, maxLength, messageId, t }) => {
  const isAtLimit = currentLength >= maxLength

  return (
    <div className={`character-count${isAtLimit ? ' is-at-limit' : ''}`}>
      <span id={messageId} role="status" aria-live="polite">
        {isAtLimit ? t('characterLimitReached') : ''}
      </span>
      <span>
        {currentLength} / {maxLength}
      </span>
    </div>
  )
}

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
      <div
        className="form-group card-layout-group"
        role="radiogroup"
        aria-labelledby="card-layout-label"
      >
        <span id="card-layout-label" className="group-label">{t('cardLayout')}</span>
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
      </div>

      {/* ポケモン名入力 */}
      <div className="form-group pokemon-name-group">
        <label htmlFor="pokemon-name">{t('pokemonName')}</label>
        <input
          id="pokemon-name"
          type="text"
          value={cardData.name}
          onChange={(e) => onInputChange(
            'name',
            e.target.value.slice(0, INPUT_LIMITS.pokemonName),
          )}
          placeholder={t('enterPokemonName')}
          maxLength={INPUT_LIMITS.pokemonName}
          aria-describedby="pokemon-name-limit"
        />
        <CharacterCount
          currentLength={cardData.name.length}
          maxLength={INPUT_LIMITS.pokemonName}
          messageId="pokemon-name-limit"
          t={t}
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
            onChange={(e) => {
              const hp = e.target.value.replace(/\D/g, '')
              const parsedHp = Number.parseInt(hp, 10)
              onInputChange('hp', Number.isNaN(parsedHp) ? '' : String(Math.min(parsedHp, 9999)))
            }}
            placeholder="100"
            min="10"
            max="9999"
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
          <div className="image-upload-help">
            <small>{t('recommendedImage')}</small>
            <small>{t('imagePrivacyNotice')}</small>
          </div>
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
              <p className="image-drag-instruction">
                <span aria-hidden="true">↔</span>
                {t('directImageAdjustmentHelp')}
              </p>
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
                  id={`ability-name-${index}`}
                  aria-label={`${t('abilityName')} ${index + 1}`}
                  type="text"
                  value={ability.name}
                  onChange={(e) => onAbilityChange(
                    index,
                    'name',
                    e.target.value.slice(0, INPUT_LIMITS.abilityName),
                  )}
                  placeholder={t('abilityName')}
                  maxLength={INPUT_LIMITS.abilityName}
                  aria-describedby={`ability-name-${index}-limit`}
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
              <CharacterCount
                currentLength={ability.name.length}
                maxLength={INPUT_LIMITS.abilityName}
                messageId={`ability-name-${index}-limit`}
                t={t}
              />
              
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
              
              <input
                id={`ability-description-${index}`}
                aria-label={`${t('abilityDescription')} ${index + 1}`}
                type="text"
                value={ability.description}
                onChange={(e) => onAbilityChange(
                  index,
                  'description',
                  e.target.value.slice(0, INPUT_LIMITS.abilityDescription),
                )}
                placeholder={t('abilityDescription')}
                maxLength={INPUT_LIMITS.abilityDescription}
                aria-describedby={`ability-description-${index}-limit`}
              />
              <CharacterCount
                currentLength={ability.description.length}
                maxLength={INPUT_LIMITS.abilityDescription}
                messageId={`ability-description-${index}-limit`}
                t={t}
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
                value={cardData.retreatCost ?? 1}
                onChange={(e) => onInputChange('retreatCost', Number.parseInt(e.target.value, 10))}
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
          onChange={(e) => {
            const twoLineValue = e.target.value
              .slice(0, INPUT_LIMITS.pokemonDescription)
              .split(/\r?\n/)
              .slice(0, 2)
              .join('\n')
            onInputChange('description', twoLineValue)
          }}
          placeholder={t('pokemonDescriptionPlaceholder')}
          maxLength={INPUT_LIMITS.pokemonDescription}
          rows={2}
          aria-describedby="pokemon-description-limit"
        />
        <CharacterCount
          currentLength={cardData.description.length}
          maxLength={INPUT_LIMITS.pokemonDescription}
          messageId="pokemon-description-limit"
          t={t}
        />
      </div>
    </div>
  )
}

export default CardForm
