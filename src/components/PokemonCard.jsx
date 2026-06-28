import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import CardArtwork from './CardArtwork'

const initialStyle = {
  '--pointer-x': '50%',
  '--pointer-y': '50%',
  '--card-brightness': '0.72',
  '--glare-brightness': '0.95',
  '--card-opacity': '0',
  '--rotate-x': '0deg',
  '--rotate-y': '0deg',
}

const PokemonCard = forwardRef(({ cardData, layoutMode, imagePreview, imageAdjustment }, ref) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [cardStyle, setCardStyle] = useState(initialStyle)

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current,
    getSvgElement: () => svgRef.current,
    getFoilPosition: () => ({
      x: Number.parseFloat(cardStyle['--pointer-x']) || 50,
      y: Number.parseFloat(cardStyle['--pointer-y']) || 50,
    }),
  }))

  const updateCardStyle = (clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height))
    const pointerX = (x / rect.width) * 100
    const pointerY = (y / rect.height) * 100
    const pointerFromCenter = Math.min(
      1,
      Math.hypot(pointerX - 50, pointerY - 50) / 50,
    )

    setCardStyle({
      '--pointer-x': `${pointerX}%`,
      '--pointer-y': `${pointerY}%`,
      '--card-brightness': (0.72 + pointerFromCenter * 0.22).toFixed(3),
      '--glare-brightness': (0.85 + (pointerY / 100) * 0.2).toFixed(3),
      '--card-opacity': '1',
      '--rotate-x': `${((pointerY - 50) / 9).toFixed(2)}deg`,
      '--rotate-y': `${((50 - pointerX) / 9).toFixed(2)}deg`,
    })
  }

  const handlePointerInteraction = (event) => {
    updateCardStyle(event.clientX, event.clientY)
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') {
      setCardStyle(initialStyle)
    }
  }

  const handleTouchInteraction = (event) => {
    const touch = event.touches[0]
    if (touch) {
      updateCardStyle(touch.clientX, touch.clientY)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`card interactive ${cardData.type}`}
      data-rarity={cardData.rarity}
      data-layout={layoutMode}
      style={cardStyle}
      onPointerDown={handlePointerInteraction}
      onPointerMove={handlePointerInteraction}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchInteraction}
      onTouchMove={handleTouchInteraction}
    >
      <div className="card__rotator">
        <CardArtwork
          cardData={cardData}
          layoutMode={layoutMode}
          imagePreview={imagePreview}
          imageAdjustment={imageAdjustment}
          svgRef={svgRef}
        />
        <div className="card__texture" aria-hidden="true" />
        <div className="card__shine" aria-hidden="true" />
        <div className="card__glare" aria-hidden="true" />
      </div>
    </div>
  )
})

PokemonCard.displayName = 'PokemonCard'

export default PokemonCard
