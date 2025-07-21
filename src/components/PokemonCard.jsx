import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

// ポケモンカード表示コンポーネント - インタラクティブな3Dホログラフィック効果付き
const PokemonCard = forwardRef(({ cardData, imagePreview }, ref) => {
  // インタラクション状態の管理
  const [isInteracting, setIsInteracting] = useState(false)
  
  // カードの3D変形効果用CSSカスタムプロパティ
  const [cardStyle, setCardStyle] = useState({
    '--pointer-x': '50%',     // マウスポインターのX座標（％）
    '--pointer-y': '50%',     // マウスポインターのY座標（％）
    '--card-opacity': '0',    // ホログラフィック効果の透明度
    '--rotate-x': '0deg',     // X軸回転角度
    '--rotate-y': '0deg',     // Y軸回転角度
    '--background-x': '50%',  // 背景グラデーションのX位置
    '--background-y': '50%'   // 背景グラデーションのY位置
  })

  const cardRef = useRef(null)

  // 親コンポーネントからカード要素にアクセスするためのref転送
  useImperativeHandle(ref, () => ({
    getElement: () => cardRef.current
  }))

  // マウス移動時の3D効果処理
  const handleMouseMove = (e) => {
    if (!isInteracting) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // マウス座標をカード要素相対座標に変換
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // カードの中心座標を計算
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // 中心からの距離に基づいて回転角度を計算（ホログラフィック効果）
    const rotateX = (y - centerY) / 10  // Y座標からX軸回転を計算
    const rotateY = -(x - centerX) / 10 // X座標からY軸回転を計算（反転）
    
    // マウス位置をパーセンテージに変換（グラデーション効果用）
    const pointerX = (x / rect.width) * 100
    const pointerY = (y / rect.height) * 100
    
    // CSSカスタムプロパティを更新してリアルタイム3D効果を適用
    setCardStyle({
      '--pointer-x': `${pointerX}%`,
      '--pointer-y': `${pointerY}%`,
      '--card-opacity': '1',              // ホログラフィック効果を表示
      '--rotate-x': `${rotateY}deg`,
      '--rotate-y': `${rotateX}deg`,
      '--background-x': `${pointerX}%`,
      '--background-y': `${pointerY}%`
    })
  }

  // マウスがカードに入った時の処理
  const handleMouseEnter = () => {
    setIsInteracting(true)
  }

  // マウスがカードから出た時の処理 - 元の状態に戻す
  const handleMouseLeave = () => {
    setIsInteracting(false)
    setCardStyle({
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--card-opacity': '0',    // ホログラフィック効果を非表示
      '--rotate-x': '0deg',     // 回転をリセット
      '--rotate-y': '0deg',
      '--background-x': '50%',
      '--background-y': '50%'
    })
  }

  // 画像が未アップロードの場合のデフォルト画像（SVG形式）
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
      {/* カードの3D変形コンテナ */}
      <div className="card__translater">
        <div className="card__rotator">
          {/* カード裏面 */}
          <img
            className="card__back"
            src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
            alt="Pokemon card back"
            loading="lazy"
          />
          
          {/* カード表面 */}
          <div className="card__front">
            {/* ポケモン画像表示エリア */}
            <img
              className="card__image"
              src={imagePreview || defaultImage}
              alt={cardData.name}
              loading="lazy"
            />
            
            {/* カードコンテンツエリア */}
            <div className="card__content">
              {/* ヘッダー：ポケモン名、タイプアイコン、HP */}
              <div className="card__header">
                <div className="card__name-type">
                  <h3 className="card__name">{cardData.name}</h3>
                  <div className="card__type-icon" data-type={cardData.type}>
                    <span className="type-symbol">●</span>
                  </div>
                </div>
                <span className="card__hp">HP {cardData.hp}</span>
              </div>
              
              {/* ポケモンタイプ表示（改良版） */}
              <div className="card__type-label">{cardData.type}</div>
              
              {/* 中央エリア：技リスト */}
              <div className="card__middle">
                <div className="card__abilities">
                  {cardData.abilities.map((ability, index) => (
                    ability.name && (
                      <div key={index} className="card__ability">
                        <div className="ability__header">
                          <div className="ability__cost">
                            {/* エネルギーコストアイコンを表示 */}
                            {Array.from({ length: ability.energyCost || 1 }).map((_, i) => (
                              <span key={i} className="energy-icon" data-type={cardData.type}>●</span>
                            ))}
                          </div>
                          <span className="ability__name">{ability.name}</span>
                          {ability.damage && (
                            <span className="ability__damage">{ability.damage}</span>
                          )}
                        </div>
                        {ability.description && (
                          <p className="ability__description">{ability.description}</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* フッター：説明文とカード詳細 */}
              <div className="card__footer">
                {/* ポケモンの説明文 */}
                {cardData.description && (
                  <p className="card__description">{cardData.description}</p>
                )}
                
                {/* カード詳細情報：にげるコスト */}
                <div className="card__stats">
                  <div className="stat__retreat">
                    <span className="stat__label">retreat cost</span>
                    <div className="stat__value">
                      {Array.from({ length: cardData.retreatCost || 1 }).map((_, i) => (
                        <span key={i} className="retreat-icon">●</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* カード番号とレアリティ */}
                <div className="card__meta">
                  <span className="card__number">{cardData.cardNumber || '001/100'}</span>
                  <span className="card__rarity" data-rarity={cardData.rarity || 'common'}>
                    {cardData.rarity === 'holo' ? '★' : 
                     cardData.rarity === 'rare' ? '♦' : 
                     cardData.rarity === 'uncommon' ? '●' : '○'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* ホログラフィック光沢効果レイヤー */}
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