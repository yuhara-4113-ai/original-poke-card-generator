import { useState } from 'react'
import { useLanguage } from '../contexts/useLanguage'

// カードダウンロードボタンコンポーネント - PNG画像として保存機能
const DownloadButton = ({ cardRef, cardData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { t } = useLanguage() // 翻訳機能を使用

  // カード画像生成とダウンロード処理
  const generateCardImage = async () => {
    if (!cardRef?.current) {
      alert(t('alerts.cardNotAvailable'))
      return
    }

    setIsGenerating(true)

    try {
      // Canvas要素を作成してポケモンカードの寸法を設定
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // 標準的なポケモンカードの寸法 (縦横比 0.718)
      const cardWidth = 660
      const cardHeight = 921
      canvas.width = cardWidth
      canvas.height = cardHeight

      // グラデーション背景を作成
      const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight)
      
      // ポケモンタイプに基づいて背景色を設定
      const typeColors = {
        fire: ['#ff6b6b', '#ff8787'],
        water: ['#4dabf7', '#74c0fc'],
        grass: ['#51cf66', '#8ce99a'],
        electric: ['#ffd43b', '#ffec99'],
        psychic: ['#da77f2', '#e599f7'],
        ice: ['#91a7ff', '#bac8ff'],
        dragon: ['#845ef7', '#b197fc'],
        dark: ['#495057', '#6c757d'],
        fighting: ['#ff8c42', '#ffab66'],
        poison: ['#9775fa', '#b19cd9'],
        ground: ['#f08c00', '#ffb347'],
        flying: ['#d0bfff', '#e5dbff'],
        bug: ['#69db7c', '#8ce99a'],
        rock: ['#868e96', '#adb5bd'],
        ghost: ['#9775fa', '#b19cd9'],
        steel: ['#adb5bd', '#ced4da'],
        fairy: ['#ffc9c9', '#ffe0e6'],
        normal: ['#e9ecef', '#f8f9fa']
      }

      const colors = typeColors[cardData.type] || typeColors.normal
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(1, colors[1])
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      // カードの境界線を描画
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 8
      ctx.strokeRect(4, 4, cardWidth - 8, cardHeight - 8)

      // ポケモン画像があれば描画
      if (cardData.image) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = cardData.image
          })

          // ポケモン画像を中央エリアに描画
          const imgX = 50
          const imgY = 120
          const imgWidth = cardWidth - 100
          const imgHeight = 300
          
          ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight)
        } catch (error) {
          console.warn('Could not load Pokemon image:', error)
        }
      }

      // テキストコンテンツを描画
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 3
      
      // ポケモン名を描画
      ctx.font = 'bold 36px Arial, sans-serif'
      ctx.textAlign = 'left'
      const nameText = cardData.name.toUpperCase()
      ctx.strokeText(nameText, 40, 60)
      ctx.fillText(nameText, 40, 60)

      // HPを描画
      ctx.font = 'bold 24px Arial, sans-serif'
      ctx.textAlign = 'right'
      const hpText = `HP ${cardData.hp}`
      ctx.strokeText(hpText, cardWidth - 40, 60)
      ctx.fillText(hpText, cardWidth - 40, 60)

      // タイプを描画
      ctx.font = 'bold 20px Arial, sans-serif'
      ctx.textAlign = 'left'
      const typeText = cardData.type.toUpperCase()
      ctx.strokeText(typeText, 40, 100)
      ctx.fillText(typeText, 40, 100)

      // 技（アビリティ）セクションを描画
      let yPos = 460
      ctx.font = 'bold 18px Arial, sans-serif'
      
      cardData.abilities.forEach((ability) => {
        if (ability.name && ability.description) {
          // 技名を描画
          ctx.strokeText(ability.name.toUpperCase(), 40, yPos)
          ctx.fillText(ability.name.toUpperCase(), 40, yPos)
          
          // 技の説明を描画（自動改行処理）
          yPos += 25
          ctx.font = '14px Arial, sans-serif'
          const words = ability.description.split(' ')
          let line = ''
          const maxWidth = cardWidth - 80
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' '
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && i > 0) {
              ctx.strokeText(line, 50, yPos)
              ctx.fillText(line, 50, yPos)
              line = words[i] + ' '
              yPos += 18
            } else {
              line = testLine
            }
          }
          
          ctx.strokeText(line, 50, yPos)
          ctx.fillText(line, 50, yPos)
          yPos += 35
          ctx.font = 'bold 18px Arial, sans-serif'
        }
      })

      // ポケモンの説明を描画
      if (cardData.description) {
        yPos += 20
        ctx.font = 'italic 16px Arial, sans-serif'
        
        const words = cardData.description.split(' ')
        let line = ''
        const maxWidth = cardWidth - 80
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const metrics = ctx.measureText(testLine)
          
          if (metrics.width > maxWidth && i > 0) {
            ctx.strokeText(line, 40, yPos)
            ctx.fillText(line, 40, yPos)
            line = words[i] + ' '
            yPos += 22
          } else {
            line = testLine
          }
        }
        
        ctx.strokeText(line, 40, yPos)
        ctx.fillText(line, 40, yPos)
      }

      // 著作権表示を追加
      ctx.font = '12px Arial, sans-serif'
      ctx.textAlign = 'center'
      const copyrightText = 'Created with Pokemon Cards CSS (GPL-3.0)'
      ctx.strokeText(copyrightText, cardWidth / 2, cardHeight - 20)
      ctx.fillText(copyrightText, cardWidth / 2, cardHeight - 20)

      // 画像をダウンロード
      const dataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${cardData.name.replace(/\s+/g, '_')}_pokemon_card.png`
      link.href = dataURL
      link.click()

    } catch (error) {
      console.error('Error generating card image:', error)
      alert(t('alerts.errorGenerating'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="download-section">
      <button
        className={`download-button ${isGenerating ? 'generating' : ''}`}
        onClick={generateCardImage}
        disabled={isGenerating}
      >
        {isGenerating ? t('generating') : t('downloadCard')}
      </button>
      <p className="download-info">
        <small>{t('downloadInfo')}</small>
      </p>
    </div>
  )
}

export default DownloadButton