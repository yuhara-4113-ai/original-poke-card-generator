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

const svgToPng = async (sourceSvg) => {
  const svg = sourceSvg.cloneNode(true)
  svg.setAttribute('width', CARD_WIDTH)
  svg.setAttribute('height', CARD_HEIGHT)
  svg.removeAttribute('class')
  svg.removeAttribute('role')
  svg.removeAttribute('aria-label')
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

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create PNG')), 'image/png', 1)
    })
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const DownloadButton = ({ cardRef, cardData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
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
      const blob = await svgToPng(svg)
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
