import { useRef } from 'react'

const CardForm = ({ 
  cardData, 
  onInputChange, 
  onImageUpload, 
  onAbilityChange, 
  onAddAbility, 
  onRemoveAbility 
}) => {
  const fileInputRef = useRef(null)

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="card-form">
      <div className="form-group">
        <label htmlFor="pokemon-name">Pokemon Name</label>
        <input
          id="pokemon-name"
          type="text"
          value={cardData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Enter Pokemon name"
          maxLength={20}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pokemon-hp">HP</label>
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
          <label htmlFor="pokemon-type">Type</label>
          <select
            id="pokemon-type"
            value={cardData.type}
            onChange={(e) => onInputChange('type', e.target.value)}
          >
            {pokemonTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Pokemon Image</label>
        <div className="image-upload-section">
          <button
            type="button"
            className="image-upload-button"
            onClick={handleImageClick}
          >
            {cardData.image ? 'Change Image' : 'Upload Image'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            style={{ display: 'none' }}
          />
          <small>Recommended: Square images work best</small>
        </div>
      </div>

      <div className="form-group">
        <label>Abilities</label>
        <div className="abilities-section">
          {cardData.abilities.map((ability, index) => (
            <div key={index} className="ability-group">
              <div className="ability-header">
                <input
                  type="text"
                  value={ability.name}
                  onChange={(e) => onAbilityChange(index, 'name', e.target.value)}
                  placeholder="Ability name"
                  maxLength={20}
                />
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
                placeholder="Ability description"
                maxLength={60}
                rows={2}
              />
            </div>
          ))}
          {cardData.abilities.length < 3 && (
            <button
              type="button"
              className="add-ability"
              onClick={onAddAbility}
            >
              + Add Ability
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="pokemon-description">Description</label>
        <textarea
          id="pokemon-description"
          value={cardData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="A brief description of your Pokemon"
          maxLength={100}
          rows={3}
        />
      </div>
    </div>
  )
}

export default CardForm