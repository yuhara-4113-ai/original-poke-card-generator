import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import CardArtwork from './CardArtwork'

const CARD_WIDTH = 660
const IMAGE_BOUNDS = {
  standard: { width: 566, height: 356 },
  fullArt: { width: 600, height: 861 },
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const initialStyle = {
  '--pointer-x': '50%',
  '--pointer-y': '50%',
  '--card-brightness': '0.72',
  '--glare-brightness': '0.95',
  '--card-opacity': '0',
  '--rotate-x': '0deg',
  '--rotate-y': '0deg',
}

const PokemonCard = forwardRef(({
  cardData,
  layoutMode,
  imagePreview,
  imageAdjustment,
  imageDragLabel,
  onImageAdjustmentChange,
}, ref) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const dragStateRef = useRef(null)
  const [cardStyle, setCardStyle] = useState(initialStyle)
  const [isDraggingImage, setIsDraggingImage] = useState(false)

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
    const dragState = dragStateRef.current
    if (dragState && event.pointerId === dragState.pointerId) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const bounds = IMAGE_BOUNDS[layoutMode]
      const naturalWidth = imageAdjustment.width || bounds.width
      const naturalHeight = imageAdjustment.height || bounds.height
      const zoom = clamp(imageAdjustment.zoom || 1, 1, 2.5)
      const coverScale = Math.max(bounds.width / naturalWidth, bounds.height / naturalHeight)
      const overflowX = Math.max(0, naturalWidth * coverScale * zoom - bounds.width)
      const overflowY = Math.max(0, naturalHeight * coverScale * zoom - bounds.height)
      const svgScale = CARD_WIDTH / rect.width
      const deltaX = (event.clientX - dragState.clientX) * svgScale
      const deltaY = (event.clientY - dragState.clientY) * svgScale

      onImageAdjustmentChange({
        x: overflowX > 0
          ? clamp(dragState.x + (deltaX * 200) / overflowX, -100, 100)
          : dragState.x,
        y: overflowY > 0
          ? clamp(dragState.y + (deltaY * 200) / overflowY, -100, 100)
          : dragState.y,
      })
      return
    }

    updateCardStyle(event.clientX, event.clientY)
  }

  const handlePointerDown = (event) => {
    const isDragHandle = event.target.closest?.('[data-image-drag-handle]')
    if (isDragHandle && imagePreview && onImageAdjustmentChange) {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      dragStateRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        x: imageAdjustment.x,
        y: imageAdjustment.y,
      }
      setCardStyle(initialStyle)
      setIsDraggingImage(true)
      return
    }

    handlePointerInteraction(event)
  }

  const finishImageDrag = (event) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return
    dragStateRef.current = null
    setIsDraggingImage(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleImageKeyDown = (event) => {
    if (!imagePreview || !onImageAdjustmentChange) return

    const step = event.shiftKey ? 1 : 5
    const changes = {
      ArrowLeft: { x: clamp(imageAdjustment.x - step, -100, 100) },
      ArrowRight: { x: clamp(imageAdjustment.x + step, -100, 100) },
      ArrowUp: { y: clamp(imageAdjustment.y - step, -100, 100) },
      ArrowDown: { y: clamp(imageAdjustment.y + step, -100, 100) },
    }
    const change = changes[event.key]
    if (!change) return

    event.preventDefault()
    onImageAdjustmentChange(change)
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') {
      setCardStyle(initialStyle)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`card interactive ${cardData.type}${imagePreview ? ' is-image-adjustable' : ''}${isDraggingImage ? ' is-dragging-image' : ''}`}
      role={imagePreview ? 'group' : undefined}
      tabIndex={imagePreview ? 0 : undefined}
      aria-label={imagePreview ? imageDragLabel : undefined}
      data-rarity={cardData.rarity}
      data-layout={layoutMode}
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerInteraction}
      onPointerUp={finishImageDrag}
      onPointerCancel={finishImageDrag}
      onLostPointerCapture={finishImageDrag}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleImageKeyDown}
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
        {imagePreview && (
          <div
            className={`image-drag-surface image-drag-surface--${layoutMode}`}
            data-image-drag-handle="true"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
})

PokemonCard.displayName = 'PokemonCard'

export default PokemonCard
