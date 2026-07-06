import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/useLanguage'
import { getTypeTheme } from './cardTheme'

const CARD_WIDTH = 660
const CARD_HEIGHT = 921
const EXPORT_SCALE = 2
const WALLPAPER_WIDTH = 1440
const WALLPAPER_HEIGHT = 3120
const WALLPAPER_CARD_WIDTH = 1152
const WALLPAPER_CARD_HEIGHT = Math.round(WALLPAPER_CARD_WIDTH * (CARD_HEIGHT / CARD_WIDTH))
const WALLPAPER_CARD_MIN_Y = 520
const WALLPAPER_CARD_MAX_Y = 1240
const DEFAULT_WALLPAPER_POSITION = 72

const clampWallpaperPosition = (position) => Math.min(100, Math.max(0, position))

const getWallpaperCardY = (position) => Math.round(
  WALLPAPER_CARD_MIN_Y
  + (WALLPAPER_CARD_MAX_Y - WALLPAPER_CARD_MIN_Y) * (clampWallpaperPosition(position) / 100),
)

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
})

const inlineExternalImages = async (svg) => {
  const images = [...svg.querySelectorAll('image')]
  await Promise.all(images.map(async (image) => {
    const href = image.getAttribute('href') || image.getAttribute('xlink:href')
    if (!href || href.startsWith('data:') || href.startsWith('blob:')) return
    const response = await fetch(href)
    if (!response.ok) throw new Error(`Could not load card asset: ${href}`)
    const dataUrl = await blobToDataUrl(await response.blob())
    image.setAttribute('href', dataUrl)
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUrl)
  }))
}

const roundedRect = (context, x, y, width, height, radius) => {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

const drawFoilEffect = (context, foilPosition) => {
  const width = CARD_WIDTH * EXPORT_SCALE
  const height = CARD_HEIGHT * EXPORT_SCALE
  const pointerX = (foilPosition.x / 100) * width
  const pointerY = (foilPosition.y / 100) * height

  context.save()
  roundedRect(
    context,
    10 * EXPORT_SCALE,
    10 * EXPORT_SCALE,
    640 * EXPORT_SCALE,
    901 * EXPORT_SCALE,
    33 * EXPORT_SCALE,
  )
  context.clip()

  context.globalCompositeOperation = 'screen'
  const foil = context.createLinearGradient(
    pointerX - width,
    pointerY + height,
    pointerX + width,
    pointerY - height,
  )
  foil.addColorStop(0, 'rgba(255, 255, 255, 0)')
  foil.addColorStop(0.28, 'rgba(255, 92, 145, 0.18)')
  foil.addColorStop(0.39, 'rgba(255, 221, 105, 0.42)')
  foil.addColorStop(0.5, 'rgba(91, 231, 218, 0.4)')
  foil.addColorStop(0.61, 'rgba(105, 146, 255, 0.38)')
  foil.addColorStop(0.72, 'rgba(226, 111, 255, 0.2)')
  foil.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = foil
  context.fillRect(0, 0, width, height)

  const glareRadius = Math.max(width, height) * 0.58
  const glare = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, glareRadius)
  glare.addColorStop(0, 'rgba(255, 255, 255, 0.52)')
  glare.addColorStop(0.2, 'rgba(255, 255, 255, 0.2)')
  glare.addColorStop(0.52, 'rgba(255, 255, 255, 0)')
  context.fillStyle = glare
  context.fillRect(0, 0, width, height)
  context.restore()
}

const canvasToPng = (canvas) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create PNG')), 'image/png', 1)
})

const svgToCanvas = async (sourceSvg, includeFoil, foilPosition) => {
  const svg = sourceSvg.cloneNode(true)
  svg.setAttribute('width', CARD_WIDTH)
  svg.setAttribute('height', CARD_HEIGHT)
  svg.removeAttribute('class')
  svg.removeAttribute('role')
  svg.removeAttribute('aria-label')
  if (!includeFoil) {
    svg.querySelectorAll('[data-export-effect]').forEach((effect) => effect.remove())
  }
  await inlineExternalImages(svg)

  const svgSource = new XMLSerializer().serializeToString(svg)
  const svgUrl = URL.createObjectURL(new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const image = new Image()
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = () => reject(new Error('Could not render the card artwork'))
      image.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = CARD_WIDTH * EXPORT_SCALE
    canvas.height = CARD_HEIGHT * EXPORT_SCALE
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is not available')
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    if (includeFoil) drawFoilEffect(context, foilPosition)

    return canvas
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const createWallpaperCanvas = (cardCanvas, type, wallpaperPosition) => {
  const canvas = document.createElement('canvas')
  canvas.width = WALLPAPER_WIDTH
  canvas.height = WALLPAPER_HEIGHT
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available')

  const theme = getTypeTheme(type)
  const background = context.createLinearGradient(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT)
  background.addColorStop(0, theme.dark)
  background.addColorStop(0.48, theme.primary)
  background.addColorStop(1, theme.dark)
  context.fillStyle = background
  context.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT)

  context.save()
  context.globalAlpha = 0.16
  context.fillStyle = theme.light
  context.beginPath()
  context.arc(WALLPAPER_WIDTH * 0.08, WALLPAPER_HEIGHT * 0.18, 560, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.arc(WALLPAPER_WIDTH * 0.96, WALLPAPER_HEIGHT * 0.76, 720, 0, Math.PI * 2)
  context.fill()
  context.restore()

  const vignette = context.createRadialGradient(
    WALLPAPER_WIDTH / 2,
    WALLPAPER_HEIGHT * 0.52,
    WALLPAPER_WIDTH * 0.2,
    WALLPAPER_WIDTH / 2,
    WALLPAPER_HEIGHT * 0.52,
    WALLPAPER_HEIGHT * 0.68,
  )
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.38)')
  context.fillStyle = vignette
  context.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT)

  const cardX = (WALLPAPER_WIDTH - WALLPAPER_CARD_WIDTH) / 2
  const cardY = getWallpaperCardY(wallpaperPosition)
  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0.48)'
  context.shadowBlur = 64
  context.shadowOffsetY = 30
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    cardCanvas,
    cardX,
    cardY,
    WALLPAPER_CARD_WIDTH,
    WALLPAPER_CARD_HEIGHT,
  )
  context.restore()

  return canvas
}

const DownloadButton = ({
  cardRef,
  cardData,
  layoutMode,
  imagePreview,
  imageAdjustment,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeFoil, setIncludeFoil] = useState(false)
  const [wallpaperPosition, setWallpaperPosition] = useState(DEFAULT_WALLPAPER_POSITION)
  const [wallpaperPreviewUrl, setWallpaperPreviewUrl] = useState('')
  const [isWallpaperPanelOpen, setIsWallpaperPanelOpen] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const wallpaperPreviewRef = useRef(null)
  const wallpaperDragRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!isWallpaperPanelOpen) return undefined
    let isDisposed = false
    let previewUrl = ''
    const sourceSvg = cardRef?.current?.getSvgElement?.()
    if (!sourceSvg) return undefined

    const updatePreview = async () => {
      const svg = sourceSvg.cloneNode(true)
      svg.setAttribute('width', CARD_WIDTH)
      svg.setAttribute('height', CARD_HEIGHT)
      svg.removeAttribute('class')
      svg.removeAttribute('role')
      svg.removeAttribute('aria-label')
      await inlineExternalImages(svg)
      if (isDisposed) return

      const svgSource = new XMLSerializer().serializeToString(svg)
      previewUrl = URL.createObjectURL(new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' }))
      setWallpaperPreviewUrl(previewUrl)
    }

    updatePreview().catch((previewError) => {
      console.error('Error generating wallpaper preview:', previewError)
      if (!isDisposed) setWallpaperPreviewUrl('')
    })

    return () => {
      isDisposed = true
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [isWallpaperPanelOpen, cardRef, cardData, layoutMode, imagePreview, imageAdjustment])

  const handleWallpaperPanelToggle = (event) => {
    const isOpen = event.currentTarget.open
    setIsWallpaperPanelOpen(isOpen)
    if (!isOpen) setWallpaperPreviewUrl('')
  }

  const updateWallpaperPosition = (position) => {
    setWallpaperPosition(Math.round(clampWallpaperPosition(Number(position))))
  }

  const handleWallpaperPointerDown = (event) => {
    if (isGenerating) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    wallpaperDragRef.current = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      startPosition: wallpaperPosition,
    }
  }

  const handleWallpaperPointerMove = (event) => {
    const drag = wallpaperDragRef.current
    const previewHeight = wallpaperPreviewRef.current?.getBoundingClientRect().height
    if (!drag || drag.pointerId !== event.pointerId || !previewHeight) return

    const deltaCanvasY = ((event.clientY - drag.startClientY) / previewHeight) * WALLPAPER_HEIGHT
    const deltaPosition = (deltaCanvasY / (WALLPAPER_CARD_MAX_Y - WALLPAPER_CARD_MIN_Y)) * 100
    updateWallpaperPosition(drag.startPosition + deltaPosition)
  }

  const handleWallpaperPointerEnd = (event) => {
    if (wallpaperDragRef.current?.pointerId !== event.pointerId) return
    wallpaperDragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleWallpaperKeyDown = (event) => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    updateWallpaperPosition(wallpaperPosition + (event.key === 'ArrowUp' ? -2 : 2))
  }

  const generateImage = async (format) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', format === 'wallpaper' ? 'wallpaper_download_click' : 'card_download_click')
    }

    const svg = cardRef?.current?.getSvgElement?.()
    if (!svg) {
      setError(t('alerts.cardNotAvailable'))
      return
    }

    setIsGenerating(true)
    setError('')
    setStatus('')
    try {
      await document.fonts?.ready
      const foilPosition = cardRef.current?.getFoilPosition?.() || { x: 50, y: 50 }
      const cardCanvas = await svgToCanvas(svg, includeFoil, foilPosition)
      const exportCanvas = format === 'wallpaper'
        ? createWallpaperCanvas(cardCanvas, cardData.type, wallpaperPosition)
        : cardCanvas
      const blob = await canvasToPng(exportCanvas)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeName = (cardData.name || 'original-card').trim().replace(/[^\p{L}\p{N}_-]+/gu, '_')
      const suffix = format === 'wallpaper' ? '-wallpaper' : ''
      link.download = `${safeName || 'original-card'}${suffix}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus(t('downloadSuccess'))
    } catch (generationError) {
      console.error('Error generating card image:', generationError)
      setError(t('alerts.errorGenerating'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="download-section">
      <label className="foil-toggle">
        <input
          type="checkbox"
          checked={includeFoil}
          onChange={(event) => setIncludeFoil(event.target.checked)}
          disabled={isGenerating}
        />
        <span className="foil-toggle-track" aria-hidden="true" />
        <span className="foil-toggle-label">{t('includeFoil')}</span>
        <strong>{includeFoil ? t('foilOn') : t('foilOff')}</strong>
      </label>
      <div className="download-actions">
        <button
          type="button"
          className="download-button"
          onClick={() => generateImage('card')}
          disabled={isGenerating}
        >
          <span aria-hidden="true">{isGenerating ? '◌' : '↓'}</span>
          {isGenerating ? t('generating') : t('downloadCard')}
        </button>
        <details
          className="wallpaper-position-panel"
          onToggle={handleWallpaperPanelToggle}
        >
          <summary>{t('adjustWallpaperPosition')}</summary>
          <div className="wallpaper-position-content">
            <p>{t('wallpaperPositionHelp')}</p>
            <div
              ref={wallpaperPreviewRef}
              className="wallpaper-preview"
              style={{
                '--wallpaper-dark': getTypeTheme(cardData.type).dark,
                '--wallpaper-primary': getTypeTheme(cardData.type).primary,
                '--wallpaper-light': getTypeTheme(cardData.type).light,
              }}
            >
              <button
                type="button"
                className="wallpaper-preview-card"
                style={{ top: `${(getWallpaperCardY(wallpaperPosition) / WALLPAPER_HEIGHT) * 100}%` }}
                onPointerDown={handleWallpaperPointerDown}
                onPointerMove={handleWallpaperPointerMove}
                onPointerUp={handleWallpaperPointerEnd}
                onPointerCancel={handleWallpaperPointerEnd}
                onKeyDown={handleWallpaperKeyDown}
                disabled={isGenerating}
                aria-label={t('wallpaperPositionDragLabel')}
              >
                {wallpaperPreviewUrl
                  ? <img src={wallpaperPreviewUrl} alt="" draggable="false" />
                  : <span className="wallpaper-preview-placeholder">CARD</span>}
              </button>
            </div>
            <div className="wallpaper-position-control">
              <label htmlFor="wallpaper-position">
                <span>{t('wallpaperPosition')}</span>
                <output htmlFor="wallpaper-position">{Math.round(wallpaperPosition)}%</output>
              </label>
              <input
                id="wallpaper-position"
                type="range"
                min="0"
                max="100"
                step="1"
                value={wallpaperPosition}
                onChange={(event) => updateWallpaperPosition(event.target.value)}
                disabled={isGenerating}
              />
              <div className="wallpaper-position-axis" aria-hidden="true">
                <span>{t('wallpaperPositionTop')}</span>
                <span>{t('wallpaperPositionBottom')}</span>
              </div>
            </div>
            <button
              type="button"
              className="wallpaper-position-reset"
              onClick={() => updateWallpaperPosition(DEFAULT_WALLPAPER_POSITION)}
              disabled={isGenerating || wallpaperPosition === DEFAULT_WALLPAPER_POSITION}
            >
              {t('resetWallpaperPosition')}
            </button>
          </div>
        </details>
        <button
          type="button"
          className="download-button download-button--wallpaper"
          onClick={() => generateImage('wallpaper')}
          disabled={isGenerating}
        >
          <span aria-hidden="true">{isGenerating ? '◌' : '↓'}</span>
          {isGenerating ? t('generating') : t('downloadWallpaper')}
        </button>
      </div>
      <p className="download-info">{t('downloadInfo')}<br />{t('wallpaperDownloadInfo')}</p>
      <p className="download-error" role="alert">{error}</p>
      <p className="download-status" role="status">{status}</p>
    </div>
  )
}

export default DownloadButton
