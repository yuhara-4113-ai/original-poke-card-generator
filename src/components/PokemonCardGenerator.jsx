import { useState, useRef } from 'react'
import PokemonCard from './PokemonCard'
import CardForm from './CardForm'
import DownloadButton from './DownloadButton'
import './PokemonCardGenerator.css'

const PokemonCardGenerator = () => {
  const [cardData, setCardData] = useState({
    name: 'Custom Pokemon',
    hp: '100',
    type: 'normal',
    image: null,
    abilities: [
      { name: 'Custom Ability', description: 'Your custom ability description.' }
    ],
    description: 'A unique and original Pokemon created by you!'
  })

  const [imagePreview, setImagePreview] = useState(null)
  const cardRef = useRef(null)

  // Sample cards for demonstration
  const sampleCards = [
    {
      name: 'Blazemon',
      hp: '120',
      type: 'fire',
      abilities: [
        { name: 'Fire Blast', description: 'Deals massive fire damage to opponents.' },
        { name: 'Heat Wave', description: 'Burns all nearby enemies.' }
      ],
      description: 'A fierce fire-type Pokemon with incredible heat powers.'
    },
    {
      name: 'Aquaflow',
      hp: '90',
      type: 'water',
      abilities: [
        { name: 'Tidal Wave', description: 'Creates massive water attacks.' }
      ],
      description: 'A graceful water Pokemon that controls ocean currents.'
    },
    {
      name: 'Thunderstrike',
      hp: '110',
      type: 'electric',
      abilities: [
        { name: 'Lightning Bolt', description: 'Strikes with pure electric energy.' },
        { name: 'Static Shield', description: 'Creates protective electric barriers.' }
      ],
      description: 'An electric Pokemon crackling with storm energy.'
    }
  ]

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

  const handleInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleAbilityChange = (index, field, value) => {
    const newAbilities = [...cardData.abilities]
    newAbilities[index] = { ...newAbilities[index], [field]: value }
    setCardData(prev => ({ ...prev, abilities: newAbilities }))
  }

  const addAbility = () => {
    if (cardData.abilities.length < 3) {
      setCardData(prev => ({
        ...prev,
        abilities: [...prev.abilities, { name: '', description: '' }]
      }))
    }
  }

  const removeAbility = (index) => {
    if (cardData.abilities.length > 1) {
      const newAbilities = cardData.abilities.filter((_, i) => i !== index)
      setCardData(prev => ({ ...prev, abilities: newAbilities }))
    }
  }

  const loadSampleCard = (sample) => {
    setCardData({ ...sample, image: null })
    setImagePreview(null)
  }

  const resetCard = () => {
    setCardData({
      name: 'Custom Pokemon',
      hp: '100',
      type: 'normal',
      image: null,
      abilities: [
        { name: 'Custom Ability', description: 'Your custom ability description.' }
      ],
      description: 'A unique and original Pokemon created by you!'
    })
    setImagePreview(null)
  }

  return (
    <div className="card-generator">
      <div className="generator-layout">
        <div className="form-section">
          <h2>Card Customization</h2>
          
          {/* Sample Cards Section */}
          <div className="samples-section">
            <h3>Try Sample Cards</h3>
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
                Reset
              </button>
            </div>
          </div>

          <CardForm
            cardData={cardData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onAbilityChange={handleAbilityChange}
            onAddAbility={addAbility}
            onRemoveAbility={removeAbility}
          />
        </div>
        
        <div className="preview-section">
          <h2>Card Preview</h2>
          <div className="card-preview">
            <PokemonCard 
              ref={cardRef}
              cardData={cardData}
              imagePreview={imagePreview}
            />
          </div>
          <DownloadButton cardRef={cardRef} cardData={cardData} />
        </div>
      </div>
    </div>
  )
}

export default PokemonCardGenerator