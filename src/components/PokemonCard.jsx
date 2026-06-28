import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import CardArtwork from './CardArtwork'

const initialStyle = {
  '--pointer-x': '50%',
  '--pointer-y': '50%',
  '--card-opacity': '0',
  '--rotate-x': '0deg',
  '--rotate-y': '0deg',
}

const PokemonCard = forwardRef(({ cardData, imagePreview, imageAdjustment }, ref) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [cardStyle, setCardStyle] = useState(initialStyle)

  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current,
    getSvgElement: () => svgRef.current,
  }))

  const updateCardStyle = (event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))
    const pointerX = (x / rect.width) * 100
    const pointerY = (y / rect.height) * 100

    setCardStyle({
      '--pointer-x': `${pointerX}%`,
      '--pointer-y': `${pointerY}%`,
      '--card-opacity': '0.55',
      '--rotate-x': `${((pointerY - 50) / 9).toFixed(2)}deg`,
      '--rotate-y': `${((50 - pointerX) / 9).toFixed(2)}deg`,
    })
  }

  const handlePointerDown = (event) => {
    updateCardStyle(event)
    if (event.pointerType === 'touch') {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
  }

  const handlePointerEnd = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType !== 'touch') {
      setCardStyle(initialStyle)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`card interactive ${cardData.type}`}
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={updateCardStyle}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerLeave}
    >
      <div className="card__rotator">
        <CardArtwork
          cardData={cardData}
          imagePreview={imagePreview}
          imageAdjustment={imageAdjustment}
          svgRef={svgRef}
        />
        <div className="card__shine" aria-hidden="true" />
        <div className="card__glare" aria-hidden="true" />
      </div>
    </div>
  )
})

PokemonCard.displayName = 'PokemonCard'

export default PokemonCard
