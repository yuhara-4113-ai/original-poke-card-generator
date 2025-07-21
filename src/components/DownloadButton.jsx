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

      // 角丸のためのクリッピングパスを作成
      const radius = 30 // 角丸の半径
      ctx.beginPath()
      
      // roundRect メソッドが利用可能でない場合の互換性対応
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, cardWidth, cardHeight, radius)
      } else {
        // 手動で角丸の描画
        ctx.moveTo(radius, 0)
        ctx.lineTo(cardWidth - radius, 0)
        ctx.quadraticCurveTo(cardWidth, 0, cardWidth, radius)
        ctx.lineTo(cardWidth, cardHeight - radius)
        ctx.quadraticCurveTo(cardWidth, cardHeight, cardWidth - radius, cardHeight)
        ctx.lineTo(radius, cardHeight)
        ctx.quadraticCurveTo(0, cardHeight, 0, cardHeight - radius)
        ctx.lineTo(0, radius)
        ctx.quadraticCurveTo(0, 0, radius, 0)
      }
      ctx.clip()

      // ポケモン画像を背景として全面に描画（プレビューと同様に）
      if (cardData.image) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = cardData.image
          })

          // 画像の縦横比を保持しながらカード全面を覆うように描画（object-fit: cover と同様）
          const imgAspect = img.width / img.height
          const cardAspect = cardWidth / cardHeight
          
          let drawWidth, drawHeight, drawX, drawY
          
          if (imgAspect > cardAspect) {
            // 画像が横長：高さを基準にスケーリング
            drawHeight = cardHeight
            drawWidth = drawHeight * imgAspect
            drawX = (cardWidth - drawWidth) / 2
            drawY = 0
          } else {
            // 画像が縦長または正方形：幅を基準にスケーリング
            drawWidth = cardWidth
            drawHeight = drawWidth / imgAspect
            drawX = 0
            drawY = (cardHeight - drawHeight) / 2
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
        } catch (error) {
          console.warn('Could not load Pokemon image:', error)
          // 画像読み込み失敗時は単色背景
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
          const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight)
          gradient.addColorStop(0, colors[0])
          gradient.addColorStop(1, colors[1])
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, cardWidth, cardHeight)
        }
      } else {
        // 画像がない場合はタイプ別グラデーション背景
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
        const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, cardWidth, cardHeight)
      }

      // 半透明のオーバーレイを追加してテキストの可読性を向上
      const overlayGradient = ctx.createLinearGradient(0, 0, 0, cardHeight)
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
      overlayGradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.1)')
      overlayGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.1)')
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      // テキストコンテンツを描画（プレビューと同様のスタイル）
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      
      // ポケモン名を描画
      ctx.font = 'bold 42px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'left'
      const nameText = cardData.name.toUpperCase()
      ctx.strokeText(nameText, 30, 70)
      ctx.fillText(nameText, 30, 70)

      // HPを描画
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'right'
      const hpText = `HP ${cardData.hp}`
      ctx.strokeText(hpText, cardWidth - 30, 70)
      ctx.fillText(hpText, cardWidth - 30, 70)

      // タイプを描画（プレビューのように背景付き）
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      
      const typeText = cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1)
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
      const typeWidth = ctx.measureText(typeText).width
      
      // 角丸背景を手動描画
      const bgX = 30, bgY = 90, bgWidth = typeWidth + 20, bgHeight = 35, bgRadius = 15
      ctx.beginPath()
      ctx.moveTo(bgX + bgRadius, bgY)
      ctx.lineTo(bgX + bgWidth - bgRadius, bgY)
      ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + bgRadius)
      ctx.lineTo(bgX + bgWidth, bgY + bgHeight - bgRadius)
      ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - bgRadius, bgY + bgHeight)
      ctx.lineTo(bgX + bgRadius, bgY + bgHeight)
      ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - bgRadius)
      ctx.lineTo(bgX, bgY + bgRadius)
      ctx.quadraticCurveTo(bgX, bgY, bgX + bgRadius, bgY)
      ctx.fill()
      
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.fillText(typeText, 40, 112)
      ctx.restore()

      // フッターエリア（技と説明）をプレビューと同様に描画
      if (cardData.abilities.length > 0 || cardData.description) {
        // フッター背景を描画
        const footerHeight = Math.max(200, cardData.abilities.length * 60 + 100)
        const footerY = cardHeight - footerHeight - 30
        
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        
        // 角丸背景を手動描画
        const fX = 30, fY = footerY, fWidth = cardWidth - 60, fHeight = footerHeight, fRadius = 12
        ctx.beginPath()
        ctx.moveTo(fX + fRadius, fY)
        ctx.lineTo(fX + fWidth - fRadius, fY)
        ctx.quadraticCurveTo(fX + fWidth, fY, fX + fWidth, fY + fRadius)
        ctx.lineTo(fX + fWidth, fY + fHeight - fRadius)
        ctx.quadraticCurveTo(fX + fWidth, fY + fHeight, fX + fWidth - fRadius, fY + fHeight)
        ctx.lineTo(fX + fRadius, fY + fHeight)
        ctx.quadraticCurveTo(fX, fY + fHeight, fX, fY + fHeight - fRadius)
        ctx.lineTo(fX, fY + fRadius)
        ctx.quadraticCurveTo(fX, fY, fX + fRadius, fY)
        ctx.fill()
        ctx.restore()
        
        // 技（アビリティ）セクションを描画
        let yPos = footerY + 40
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 1
        
        cardData.abilities.forEach((ability) => {
          if (ability.name && ability.description) {
            // 技名を描画
            ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'left'
            ctx.strokeText(ability.name, 50, yPos)
            ctx.fillText(ability.name, 50, yPos)
            
            // 技の説明を描画（自動改行処理）
            yPos += 25
            ctx.font = '16px system-ui, -apple-system, sans-serif'
            const words = ability.description.split(' ')
            let line = ''
            const maxWidth = cardWidth - 120
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' '
              const metrics = ctx.measureText(testLine)
              
              if (metrics.width > maxWidth && i > 0) {
                ctx.strokeText(line, 60, yPos)
                ctx.fillText(line, 60, yPos)
                line = words[i] + ' '
                yPos += 20
              } else {
                line = testLine
              }
            }
            
            ctx.strokeText(line, 60, yPos)
            ctx.fillText(line, 60, yPos)
            yPos += 35
          }
        })

        // ポケモンの説明を描画
        if (cardData.description) {
          yPos += 10
          ctx.font = 'italic 18px system-ui, -apple-system, sans-serif'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          
          const words = cardData.description.split(' ')
          let line = ''
          const maxWidth = cardWidth - 120
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' '
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && i > 0) {
              ctx.fillText(line, 50, yPos)
              line = words[i] + ' '
              yPos += 24
            } else {
              line = testLine
            }
          }
          
          ctx.fillText(line, 50, yPos)
        }
      }

      // 著作権表示を追加
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      const copyrightText = 'Created with Pokemon Cards CSS (GPL-3.0)'
      ctx.fillText(copyrightText, cardWidth / 2, cardHeight - 15)

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