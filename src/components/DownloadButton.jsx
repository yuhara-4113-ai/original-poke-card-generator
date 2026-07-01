import { useState } from 'react'
import { useLanguage } from '../contexts/useLanguage'

const CARD_WIDTH = 660
const CARD_HEIGHT = 921
const EXPORT_SCALE = 2

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

const svgToPng = async (sourceSvg, includeFoil, foilPosition) => {
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

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create PNG')), 'image/png', 1)
    })
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const DownloadButton = ({ cardRef, cardData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeFoil, setIncludeFoil] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const { t } = useLanguage()

  const generateCardImage = async () => {
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
      const blob = await svgToPng(svg, includeFoil, foilPosition)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeName = (cardData.name || 'original-card').trim().replace(/[^\p{L}\p{N}_-]+/gu, '_')
      link.download = `${safeName || 'original-card'}.png`
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
      <button
        type="button"
        className="download-button"
        onClick={generateCardImage}
        disabled={isGenerating}
      >
        <span aria-hidden="true">{isGenerating ? '◌' : '↓'}</span>
        {isGenerating ? t('generating') : t('downloadCard')}
      </button>
      <p className="download-info">{t('downloadInfo')}</p>
      <p className="download-error" role="alert">{error}</p>
      <p className="download-status" role="status">{status}</p>
    </div>
  )
}

export default DownloadButton
