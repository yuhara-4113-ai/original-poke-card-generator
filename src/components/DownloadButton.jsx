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

      // テキストコンテンツを描画（新しいレイアウトに対応）
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      
      // ヘッダー：ポケモン名、タイプアイコン、HP
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'left'
      const nameText = cardData.name.toUpperCase()
      ctx.strokeText(nameText, 30, 60)
      ctx.fillText(nameText, 30, 60)

      // タイプアイコンの描画（色付き円）
      const typeColors = {
        fire: '#ff6b6b', water: '#4dabf7', grass: '#51cf66', electric: '#ffd43b',
        psychic: '#da77f2', fighting: '#c92a2a', poison: '#9775fa', ground: '#f59f00',
        flying: '#74c0fc', bug: '#8ce99a', rock: '#868e96', ghost: '#6c5ce7',
        dragon: '#ff922b', dark: '#495057', steel: '#adb5bd', fairy: '#fcc2d7',
        ice: '#91a7ff', normal: '#ced4da'
      }
      const typeColor = typeColors[cardData.type] || typeColors.normal
      
      ctx.save()
      ctx.fillStyle = typeColor
      ctx.beginPath()
      ctx.arc(240, 45, 10, 0, 2 * Math.PI)
      ctx.fill()
      ctx.restore()

      // HP
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'right'
      const hpText = `HP ${cardData.hp}`
      ctx.strokeText(hpText, cardWidth - 30, 60)
      ctx.fillText(hpText, cardWidth - 30, 60)

      // タイプラベル
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      const typeText = cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1)
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
      const typeWidth = ctx.measureText(typeText).width
      
      // タイプラベル背景
      const bgX = 30, bgY = 75, bgWidth = typeWidth + 16, bgHeight = 25, bgRadius = 12
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
      ctx.fillText(typeText, 38, 92)
      ctx.restore()

      // 中央：技リスト（新しいレイアウト）
      const middleY = 350
      const abilitiesHeight = Math.max(150, cardData.abilities.length * 80 + 40)
      
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      
      // 技セクション背景
      const aX = 30, aY = middleY, aWidth = cardWidth - 60, aHeight = abilitiesHeight, aRadius = 12
      ctx.beginPath()
      ctx.moveTo(aX + aRadius, aY)
      ctx.lineTo(aX + aWidth - aRadius, aY)
      ctx.quadraticCurveTo(aX + aWidth, aY, aX + aWidth, aY + aRadius)
      ctx.lineTo(aX + aWidth, aY + aHeight - aRadius)
      ctx.quadraticCurveTo(aX + aWidth, aY + aHeight, aX + aWidth - aRadius, aY + aHeight)
      ctx.lineTo(aX + aRadius, aY + aHeight)
      ctx.quadraticCurveTo(aX, aY + aHeight, aX, aY + aHeight - aRadius)
      ctx.lineTo(aX, aY + aRadius)
      ctx.quadraticCurveTo(aX, aY, aX + aRadius, aY)
      ctx.fill()
      ctx.restore()
      
      // 技の描画
      let yPos = middleY + 40
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      
      cardData.abilities.forEach((ability) => {
        if (ability.name) {
          // エネルギーコストアイコン
          const energyCost = ability.energyCost || 1
          ctx.save()
          ctx.fillStyle = typeColor
          for (let i = 0; i < energyCost; i++) {
            ctx.beginPath()
            ctx.arc(55 + i * 20, yPos - 5, 8, 0, 2 * Math.PI)
            ctx.fill()
          }
          ctx.restore()
          
          // 技名
          ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
          ctx.textAlign = 'left'
          const abilityX = 55 + energyCost * 20 + 10
          ctx.strokeText(ability.name, abilityX, yPos)
          ctx.fillText(ability.name, abilityX, yPos)
          
          // ダメージ値
          if (ability.damage) {
            ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'right'
            ctx.fillStyle = '#ffd43b'
            ctx.strokeText(ability.damage, cardWidth - 50, yPos)
            ctx.fillText(ability.damage, cardWidth - 50, yPos)
            ctx.fillStyle = '#fff'
          }
          
          // 技の説明
          if (ability.description) {
            yPos += 20
            ctx.font = '14px system-ui, -apple-system, sans-serif'
            ctx.textAlign = 'left'
            const maxWidth = cardWidth - 120
            const words = ability.description.split(' ')
            let line = ''
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' '
              const metrics = ctx.measureText(testLine)
              
              if (metrics.width > maxWidth && i > 0) {
                ctx.strokeText(line, 60, yPos)
                ctx.fillText(line, 60, yPos)
                line = words[i] + ' '
                yPos += 18
              } else {
                line = testLine
              }
            }
            ctx.strokeText(line, 60, yPos)
            ctx.fillText(line, 60, yPos)
          }
          
          yPos += 35
        }
      })

      // フッター：説明文とカード詳細
      const footerY = cardHeight - 200
      
      // 説明文
      if (cardData.description) {
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        
        // 説明文背景
        const dX = 30, dY = footerY, dWidth = cardWidth - 60, dHeight = 40, dRadius = 8
        ctx.beginPath()
        ctx.moveTo(dX + dRadius, dY)
        ctx.lineTo(dX + dWidth - dRadius, dY)
        ctx.quadraticCurveTo(dX + dWidth, dY, dX + dWidth, dY + dRadius)
        ctx.lineTo(dX + dWidth, dY + dHeight - dRadius)
        ctx.quadraticCurveTo(dX + dWidth, dY + dHeight, dX + dWidth - dRadius, dY + dHeight)
        ctx.lineTo(dX + dRadius, dY + dHeight)
        ctx.quadraticCurveTo(dX, dY + dHeight, dX, dY + dHeight - dRadius)
        ctx.lineTo(dX, dY + dRadius)
        ctx.quadraticCurveTo(dX, dY, dX + dRadius, dY)
        ctx.fill()
        ctx.restore()
        
        ctx.font = 'italic 14px system-ui, -apple-system, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillStyle = '#fff'
        ctx.strokeText(cardData.description, 45, footerY + 25)
        ctx.fillText(cardData.description, 45, footerY + 25)
      }

      // カード詳細情報：弱点、抵抗力、にげるコスト
      const statsY = footerY + 60
      ctx.font = '12px system-ui, -apple-system, sans-serif'
      
      let statsX = 50
      
      // 弱点
      if (cardData.weakness && cardData.weakness !== 'none') {
        ctx.textAlign = 'center'
        ctx.fillStyle = '#aaa'
        ctx.fillText('weakness', statsX, statsY)
        
        // 弱点タイプアイコン
        const weaknessColor = typeColors[cardData.weakness] || typeColors.normal
        ctx.save()
        ctx.fillStyle = weaknessColor
        ctx.beginPath()
        ctx.arc(statsX, statsY + 15, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
        
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
        ctx.fillText('×2', statsX, statsY + 35)
        
        statsX += 80
      }
      
      // 抵抗力
      if (cardData.resistance && cardData.resistance !== 'none') {
        ctx.textAlign = 'center'
        ctx.fillStyle = '#aaa'
        ctx.font = '12px system-ui, -apple-system, sans-serif'
        ctx.fillText('resistance', statsX, statsY)
        
        // 抵抗力タイプアイコン
        const resistanceColor = typeColors[cardData.resistance] || typeColors.normal
        ctx.save()
        ctx.fillStyle = resistanceColor
        ctx.beginPath()
        ctx.arc(statsX, statsY + 15, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
        
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
        ctx.fillText('-30', statsX, statsY + 35)
        
        statsX += 80
      }
      
      // にげるコスト
      ctx.textAlign = 'center'
      ctx.fillStyle = '#aaa'
      ctx.font = '12px system-ui, -apple-system, sans-serif'
      ctx.fillText('retreat cost', statsX, statsY)
      
      const retreatCost = cardData.retreatCost || 1
      ctx.save()
      ctx.fillStyle = '#ced4da'
      for (let i = 0; i < retreatCost; i++) {
        ctx.beginPath()
        ctx.arc(statsX + (i - retreatCost/2 + 0.5) * 16, statsY + 15, 6, 0, 2 * Math.PI)
        ctx.fill()
      }
      ctx.restore()

      // カード番号とレアリティ
      const metaY = cardHeight - 30
      
      // カード番号
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#ccc'
      ctx.fillText(cardData.cardNumber || '001/100', 30, metaY)
      
      // レアリティシンボル
      ctx.textAlign = 'right'
      const raritySymbols = { common: '○', uncommon: '●', rare: '♦', holo: '★' }
      const rarityColors = { common: '#adb5bd', uncommon: '#51cf66', rare: '#4dabf7', holo: '#ffd43b' }
      
      ctx.fillStyle = rarityColors[cardData.rarity] || rarityColors.common
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
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