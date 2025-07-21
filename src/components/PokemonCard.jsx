import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

const PokemonCard = forwardRef(({ cardData, imagePreview }, ref) => {
  const [isInteracting, setIsInteracting] = useState(false)
  const [cardStyle, setCardStyle] = useState({
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--card-opacity': '0',
    '--rotate-x': '0deg',
    '--rotate-y': '0deg',
    '--background-x': '50%',
    '--background-y': '50%'
  })

  const cardRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getElement: () => cardRef.current
  }))

  const handleMouseMove = (e) => {
    if (!isInteracting) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = -(x - centerX) / 10
    
    const pointerX = (x / rect.width) * 100
    const pointerY = (y / rect.height) * 100
    
    setCardStyle({
      '--pointer-x': `${pointerX}%`,
      '--pointer-y': `${pointerY}%`,
      '--card-opacity': '1',
      '--rotate-x': `${rotateY}deg`,
      '--rotate-y': `${rotateX}deg`,
      '--background-x': `${pointerX}%`,
      '--background-y': `${pointerY}%`
    })
  }

  const handleMouseEnter = () => {
    setIsInteracting(true)
  }

  const handleMouseLeave = () => {
    setIsInteracting(false)
    setCardStyle({
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--card-opacity': '0',
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--background-x': '50%',
      '--background-y': '50%'
    })
  }

  const defaultImage = "data:image/svg+xml,%3Csvg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='16'%3EUpload Image%3C/text%3E%3C/svg%3E"

  return (
    <div 
      ref={cardRef}
      className={`card interactive ${cardData.type} ${isInteracting ? 'interacting' : ''}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card__translater">
        <div className="card__rotator">
          <img
            className="card__back"
            src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
            alt="Pokemon card back"
            loading="lazy"
          />
          <div className="card__front">
            <img
              className="card__image"
              src={imagePreview || defaultImage}
              alt={cardData.name}
              loading="lazy"
            />
            <div className="card__content">
              <div className="card__header">
                <h3 className="card__name">{cardData.name}</h3>
                <span className="card__hp">HP {cardData.hp}</span>
              </div>
              <div className="card__type">{cardData.type}</div>
              <div className="card__footer">
                <div className="card__abilities">
                  {cardData.abilities.map((ability, index) => (
                    ability.name && (
                      <div key={index} className="card__ability">
                        <strong>{ability.name}:</strong> {ability.description}
                      </div>
                    )
                  ))}
                </div>
                <p className="card__description">{cardData.description}</p>
              </div>
            </div>
            <div className="card__shine"></div>
            <div className="card__glare"></div>
          </div>
        </div>
      </div>
    </div>
  )
})

PokemonCard.displayName = 'PokemonCard'

export default PokemonCard