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

  return (
    <div className="card-generator">
      <div className="generator-layout">
        <div className="form-section">
          <h2>Card Customization</h2>
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