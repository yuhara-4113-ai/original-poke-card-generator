import { getTypeIcon, getTypeTheme } from './cardTheme'

const CARD_WIDTH = 660
const CARD_HEIGHT = 921
const ART_X = 47
const ART_Y = 119
const ART_WIDTH = 566
const ART_HEIGHT = 356
const FULL_ART_X = 30
const FULL_ART_Y = 30
const FULL_ART_WIDTH = 600
const FULL_ART_HEIGHT = 861

const getRetreatCost = (value) => {
  const cost = Number.parseInt(value ?? 1, 10)
  return Number.isNaN(cost) ? 1 : Math.max(0, Math.min(cost, 5))
}

const getTextUnits = (text) => [...text].reduce((total, character) => (
  total + (/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u.test(character) ? 1 : 0.56)
), 0)

const wrapText = (value, maxUnits, maxLines = 2) => {
  const text = String(value || '').trim()
  if (!text) return []

  const tokens = /\s/.test(text) ? text.split(/(\s+)/).filter(Boolean) : [...text]
  const lines = []
  let current = ''

  tokens.forEach((token) => {
    if (lines.length >= maxLines) return
    const candidate = `${current}${token}`
    if (current && getTextUnits(candidate) > maxUnits) {
      lines.push(current.trim())
      current = token.trimStart()
    } else {
      current = candidate
    }
  })

  if (current && lines.length < maxLines) lines.push(current.trim())
  const normalize = (content) => content.replace(/\s+/g, '')
  if (lines.length === maxLines && normalize(lines.join('')).length < normalize(text).length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.…]+$/, '')}…`
  }
  return lines
}

const TextLines = ({ lines, x, y, lineHeight, ...props }) => (
  <text x={x} y={y} {...props}>
    {lines.map((line, index) => (
      <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>{line}</tspan>
    ))}
  </text>
)

const getCoverLayout = (imageAdjustment, bounds) => {
  const naturalWidth = imageAdjustment?.width || bounds.width
  const naturalHeight = imageAdjustment?.height || bounds.height
  const zoom = Math.min(2.5, Math.max(1, imageAdjustment?.zoom || 1))
  const baseImageScale = Math.max(bounds.width / naturalWidth, bounds.height / naturalHeight)
  const width = naturalWidth * baseImageScale * zoom
  const height = naturalHeight * baseImageScale * zoom
  const overflowX = Math.max(0, width - bounds.width)
  const overflowY = Math.max(0, height - bounds.height)

  return {
    width,
    height,
    x: bounds.x - overflowX / 2 + ((imageAdjustment?.x || 0) / 100) * (overflowX / 2),
    y: bounds.y - overflowY / 2 + ((imageAdjustment?.y || 0) / 100) * (overflowY / 2),
  }
}

const FullArtCard = ({ cardData, imagePreview, imageAdjustment, svgRef }) => {
  const theme = getTypeTheme(cardData.type)
  const typeIcon = getTypeIcon(cardData.type)
  const abilities = cardData.abilities.filter((ability) => ability.name).slice(0, 2)
  const nameUnits = getTextUnits(cardData.name || '')
  const nameSize = Math.max(22, 38 - Math.max(0, nameUnits - 9) * 2.5)
  const raritySymbols = { common: '○', uncommon: '●', rare: '◆', holo: '★' }
  const photo = getCoverLayout(imageAdjustment, {
    x: FULL_ART_X,
    y: FULL_ART_Y,
    width: FULL_ART_WIDTH,
    height: FULL_ART_HEIGHT,
  })
  const abilityStartY = abilities.length > 1 ? 590 : 690

  return (
    <svg
      ref={svgRef}
      className="card-artwork"
      viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      role="img"
      aria-label={`${cardData.name} card preview`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="full-art-zebra-satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f1e8" />
          <stop offset="0.32" stopColor="#b9b7b0" />
          <stop offset="0.58" stopColor="#ece8de" />
          <stop offset="0.82" stopColor="#989995" />
          <stop offset="1" stopColor="#f7f3ea" />
        </linearGradient>
        <pattern id="full-art-zebra" width="120" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
          <rect width="120" height="180" fill="#111516" />
          <path
            d="M-34 -14 C8 3 20 28 9 55 C-3 84 19 105 65 118 C92 126 111 145 130 178 L130 207 C95 163 67 151 32 140 C-18 124 -35 90 -21 52 C-11 26 -20 10 -34 4 Z"
            fill="url(#full-art-zebra-satin)"
          />
          <path
            d="M69 -24 C111 4 119 32 99 61 C82 85 94 106 132 126 L132 157 C70 129 54 88 76 53 C92 28 90 9 69 -2 Z"
            fill="#aaa9a3"
          />
          <path
            d="M-34 -14 C8 3 20 28 9 55 C-3 84 19 105 65 118 C92 126 111 145 130 178"
            fill="none"
            stroke="#fffaf0"
            strokeOpacity="0.42"
            strokeWidth="2"
          />
        </pattern>
        <linearGradient id="full-art-placeholder" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.light} />
          <stop offset="0.52" stopColor={theme.primary} />
          <stop offset="1" stopColor={theme.dark} />
        </linearGradient>
        <linearGradient id="full-art-photo-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#071012" stopOpacity="0.28" />
          <stop offset="0.22" stopColor="#071012" stopOpacity="0" />
          <stop offset="0.58" stopColor="#071012" stopOpacity="0" />
          <stop offset="1" stopColor="#071012" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="full-art-header" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f9fbf8" stopOpacity="0.9" />
          <stop offset="0.76" stopColor="#f9fbf8" stopOpacity="0.76" />
          <stop offset="1" stopColor="#f9fbf8" stopOpacity="0.88" />
        </linearGradient>
        <filter id="full-art-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#07101f" floodOpacity="0.34" />
        </filter>
        <filter id="full-art-panel-shadow" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#071012" floodOpacity="0.32" />
        </filter>
        <clipPath id="full-art-photo-clip">
          <rect x={FULL_ART_X} y={FULL_ART_Y} width={FULL_ART_WIDTH} height={FULL_ART_HEIGHT} rx="26" />
        </clipPath>
        <clipPath id="full-art-name-clip">
          <rect x="59" y="78" width="370" height="49" />
        </clipPath>
      </defs>

      <g filter="url(#full-art-shadow)">
        <rect x="10" y="10" width="640" height="901" rx="33" fill="url(#full-art-zebra)" />
        <rect x="26" y="26" width="608" height="869" rx="26" fill="#0d1112" />
      </g>

      <g clipPath="url(#full-art-photo-clip)">
        <rect x={FULL_ART_X} y={FULL_ART_Y} width={FULL_ART_WIDTH} height={FULL_ART_HEIGHT} fill="url(#full-art-placeholder)" />
        {imagePreview ? (
          <image
            href={imagePreview}
            xlinkHref={imagePreview}
            x={photo.x}
            y={photo.y}
            width={photo.width}
            height={photo.height}
            preserveAspectRatio="none"
          />
        ) : (
          <g>
            <circle cx="330" cy="395" r="118" fill="#fff" fillOpacity="0.14" />
            <circle cx="330" cy="395" r="73" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.48" strokeWidth="3" />
            <path d="M286 410l48-61 35 45 24-28 48 62H263z" fill="#fff" fillOpacity="0.86" />
            <circle cx="299" cy="359" r="12" fill={theme.primary} />
            <text x="330" y="484" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fontWeight="700" letterSpacing="0.7">ADD YOUR ARTWORK</text>
          </g>
        )}
        <rect x={FULL_ART_X} y={FULL_ART_Y} width={FULL_ART_WIDTH} height={FULL_ART_HEIGHT} fill="url(#full-art-photo-shade)" />
      </g>

      <rect x="45" y="45" width="570" height="103" rx="23" fill="url(#full-art-header)" stroke="#dce3e1" strokeWidth="2" filter="url(#full-art-panel-shadow)" />
      <rect x="61" y="58" width="103" height="24" rx="12" fill="#202627" fillOpacity="0.88" />
      <text x="112.5" y="75" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="800" letterSpacing="1.3">ORIGINAL</text>
      <text x="61" y="116" clipPath="url(#full-art-name-clip)" fill="#111516" fontFamily="Arial, Helvetica, sans-serif" fontSize={nameSize} fontWeight="850">
        {cardData.name || 'Untitled'}
      </text>
      <text x="548" y="116" textAnchor="end" fontFamily="Arial, Helvetica, sans-serif">
        <tspan fill="#303637" fontSize="15" fontWeight="800" dy="-6">HP</tspan>
        <tspan fill="#111516" fontSize="35" fontWeight="850" dy="6" dx="5">{cardData.hp || '—'}</tspan>
      </text>
      <image href={typeIcon} xlinkHref={typeIcon} x="556" y="75" width="48" height="48" />

      {abilities.map((ability, index) => {
        const y = abilityStartY + index * 101
        const cost = Math.min(Number(ability.energyCost) || 1, 5)
        const abilityX = 75 + cost * 29
        const abilityNameSize = Math.max(14, 24 - Math.max(0, getTextUnits(ability.name) - 11) * 1.1)
        const descriptionLines = wrapText(ability.description, 28, 1)

        return (
          <g key={`${ability.name}-${index}`} filter="url(#full-art-panel-shadow)">
            <rect x="46" y={y} width="568" height="91" rx="17" fill="#f8faf8" fillOpacity="0.84" stroke="#d8dfdd" strokeWidth="2" />
            {Array.from({ length: cost }).map((_, energyIndex) => (
              <image key={energyIndex} href={typeIcon} xlinkHref={typeIcon} x={64 + energyIndex * 29} y={y + 16} width="26" height="26" />
            ))}
            <text x={abilityX} y={y + 36} fill="#111516" fontFamily="Arial, Helvetica, sans-serif" fontSize={abilityNameSize} fontWeight="850">
              {ability.name}
            </text>
            {ability.damage && (
              <text x="585" y={y + 37} textAnchor="end" fill="#111516" fontFamily="Arial, Helvetica, sans-serif" fontSize="27" fontWeight="850">
                {ability.damage}
              </text>
            )}
            <TextLines
              lines={descriptionLines}
              x={abilityX}
              y={y + 59}
              lineHeight="16"
              fill="#2c3233"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="13"
            />
          </g>
        )
      })}

      <g filter="url(#full-art-panel-shadow)">
        <rect x="45" y="808" width="570" height="75" rx="18" fill="#f5f8f5" fillOpacity="0.86" stroke="#d7dedc" strokeWidth="2" />
      </g>
      <text x="65" y="837" fill="#252b2c" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.8">RETREAT</text>
      {Array.from({ length: getRetreatCost(cardData.retreatCost) }).map((_, index) => (
        <image key={index} href={getTypeIcon('normal')} xlinkHref={getTypeIcon('normal')} x={124 + index * 21} y="824" width="18" height="18" />
      ))}
      <text x="330" y="837" textAnchor="middle" fill="#303738" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="750" letterSpacing="0.8">FAN-MADE • NOT FOR SALE</text>
      <text x="65" y="868" fill="#252b2c" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="850">{cardData.cardNumber || '001/100'}</text>
      <text x="592" y="869" textAnchor="end" fill="#252b2c" fontFamily="Arial, Helvetica, sans-serif" fontSize="23" fontWeight="850">
        {raritySymbols[cardData.rarity] || raritySymbols.common}
      </text>

      <rect x="30" y="30" width="600" height="861" rx="25" fill="none" stroke="#090c0d" strokeWidth="5" />
      <rect x="25" y="25" width="610" height="871" rx="27" fill="none" stroke="#d6c8a8" strokeOpacity="0.78" strokeWidth="2" />
      <rect x="12" y="12" width="636" height="897" rx="32" fill="none" stroke="#fffaf0" strokeOpacity="0.82" strokeWidth="2" />
    </svg>
  )
}

const CardArtwork = ({ cardData, layoutMode, imagePreview, imageAdjustment, svgRef }) => {
  if (layoutMode === 'fullArt') {
    return (
      <FullArtCard
        cardData={cardData}
        imagePreview={imagePreview}
        imageAdjustment={imageAdjustment}
        svgRef={svgRef}
      />
    )
  }

  const theme = getTypeTheme(cardData.type)
  const typeIcon = getTypeIcon(cardData.type)
  const abilities = cardData.abilities.filter((ability) => ability.name).slice(0, 3)
  const nameUnits = getTextUnits(cardData.name || '')
  const nameSize = Math.max(21, 35 - Math.max(0, nameUnits - 9) * 1.5)
  const raritySymbols = { common: '○', uncommon: '●', rare: '◆', holo: '★' }
  const image = getCoverLayout(imageAdjustment, {
    x: ART_X,
    y: ART_Y,
    width: ART_WIDTH,
    height: ART_HEIGHT,
  })
  const weaknessIcon = cardData.weakness !== 'none' ? getTypeIcon(cardData.weakness) : null
  const resistanceIcon = cardData.resistance !== 'none' ? getTypeIcon(cardData.resistance) : null
  const abilityAreaY = 519
  const abilityAreaHeight = 221
  const abilityContentHeight = 64
  const abilitySlotHeight = abilityAreaHeight / Math.max(abilities.length, 1)

  return (
    <svg
      ref={svgRef}
      className="card-artwork"
      viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      role="img"
      aria-label={`${cardData.name} card preview`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="card-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff8c7" />
          <stop offset="0.2" stopColor="#d6aa3f" />
          <stop offset="0.48" stopColor="#fff1a0" />
          <stop offset="0.72" stopColor="#ad7923" />
          <stop offset="1" stopColor="#f5d87d" />
        </linearGradient>
        <linearGradient id="edge-bevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbd4" stopOpacity="0.95" />
          <stop offset="0.06" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#8b621d" stopOpacity="0.2" />
          <stop offset="0.94" stopColor="#4a3211" stopOpacity="0.72" />
          <stop offset="1" stopColor="#fff0a3" stopOpacity="0.7" />
        </linearGradient>
        <pattern id="edge-grain" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <path d="M0 1h9M0 5h9" stroke="#fff" strokeOpacity="0.12" strokeWidth="0.7" />
          <path d="M0 3h9M0 8h9" stroke="#5a3d10" strokeOpacity="0.11" strokeWidth="0.7" />
        </pattern>
        <linearGradient id="card-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.light} />
          <stop offset="0.48" stopColor={theme.surface} />
          <stop offset="1" stopColor={theme.light} />
        </linearGradient>
        <linearGradient id="art-placeholder" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.light} />
          <stop offset="1" stopColor={theme.primary} />
        </linearGradient>
        <linearGradient id="art-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor={theme.dark} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="soft-light" cx="35%" cy="15%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.65" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="type-aura" cx="85%" cy="8%" r="82%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.3" stopColor={theme.primary} stopOpacity="0.2" />
          <stop offset="1" stopColor={theme.dark} stopOpacity="0" />
        </radialGradient>
        <pattern id="card-grain" width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="0.7" fill="#fff" fillOpacity="0.34" />
          <circle cx="9" cy="8" r="0.65" fill={theme.dark} fillOpacity="0.12" />
          <path d="M0 11L4 10M8 2l3-1" stroke="#fff" strokeOpacity="0.22" strokeWidth="0.7" />
        </pattern>
        <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#07101f" floodOpacity="0.28" />
        </filter>
        <filter id="inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.dark} floodOpacity="0.32" />
        </filter>
        <clipPath id="art-clip">
          <rect x="47" y="119" width="566" height="356" rx="8" />
        </clipPath>
        <clipPath id="card-clip">
          <rect x="10" y="10" width="640" height="901" rx="33" />
        </clipPath>
        <clipPath id="header-name-clip">
          <rect x="48" y="70" width="380" height="46" />
        </clipPath>
      </defs>

      <g filter="url(#card-shadow)">
        <rect x="8" y="8" width="644" height="905" rx="35" fill="#31230f" />
        <rect x="12" y="12" width="636" height="897" rx="32" fill="url(#card-edge)" />
        <rect x="12" y="12" width="636" height="897" rx="32" fill="url(#edge-grain)" />
        <rect x="16" y="16" width="628" height="889" rx="29" fill="none" stroke="url(#edge-bevel)" strokeWidth="8" />
        <rect x="27" y="27" width="606" height="867" rx="23" fill="#463115" />
        <rect x="30" y="30" width="600" height="861" rx="21" fill="url(#card-edge)" />
        <rect x="36" y="36" width="588" height="849" rx="17" fill="url(#card-surface)" />
      </g>

      <rect x="36" y="36" width="588" height="849" rx="17" fill="url(#type-aura)" />
      <g clipPath="url(#card-clip)" opacity="0.14" fill="none" stroke={theme.primary}>
        <circle cx="594" cy="72" r="142" strokeWidth="31" />
        <circle cx="50" cy="846" r="164" strokeWidth="38" />
        <path d="M-20 347 C168 262 246 386 402 315 S705 264 730 180" strokeWidth="12" />
      </g>
      <rect x="36" y="36" width="588" height="849" rx="17" fill="url(#card-grain)" />

      <rect x="48" y="48" width="86" height="19" rx="9.5" fill={theme.dark} />
      <text x="91" y="61" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="800" letterSpacing="1.2">BASIC</text>
      <text x="51" y="100" clipPath="url(#header-name-clip)" fill="#111" fontFamily="Arial, Helvetica, sans-serif" fontSize={nameSize} fontWeight="850" letterSpacing="-0.5">
        {cardData.name || 'Untitled'}
      </text>
      <text x="558" y="97" textAnchor="end" fontFamily="Arial, Helvetica, sans-serif">
        <tspan fill={theme.dark} fontSize="13" fontWeight="850" dy="-3">HP</tspan>
        <tspan fill="#111" fontSize="36" fontWeight="900" letterSpacing="-1" dy="3" dx="5">{cardData.hp || '—'}</tspan>
      </text>
      <image href={typeIcon} xlinkHref={typeIcon} x="566" y="57" width="46" height="46" />

      <g clipPath="url(#art-clip)">
        <rect x="47" y="119" width="566" height="356" fill="url(#art-placeholder)" />
        {imagePreview ? (
          <image
            href={imagePreview}
            xlinkHref={imagePreview}
            x={image.x}
            y={image.y}
            width={image.width}
            height={image.height}
            preserveAspectRatio="none"
          />
        ) : (
          <g>
            <circle cx="330" cy="278" r="104" fill="#fff" fillOpacity="0.16" />
            <circle cx="330" cy="278" r="65" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" />
            <path d="M292 292l42-54 31 40 21-24 42 55H272z" fill="#fff" fillOpacity="0.82" />
            <circle cx="302" cy="247" r="11" fill={theme.primary} />
            <text x="330" y="352" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fontWeight="700" letterSpacing="0.5">ADD YOUR ARTWORK</text>
          </g>
        )}
        <rect data-export-effect="artwork-lighting" x="47" y="119" width="566" height="356" fill="url(#art-shade)" />
        <rect data-export-effect="artwork-lighting" x="47" y="119" width="566" height="356" fill="url(#soft-light)" />
      </g>
      <rect x="44" y="116" width="572" height="362" rx="10" fill="none" stroke="#5b4318" strokeWidth="7" filter="url(#inner-shadow)" />
      <rect x="49" y="121" width="562" height="352" rx="5" fill="none" stroke="#fff1a7" strokeOpacity="0.74" strokeWidth="2" />
      <path d="M59 480H601L586 508H74Z" fill={theme.dark} />
      <text x="330" y="499" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="11.5" fontWeight="750" letterSpacing="0.45">
        NO. 001  ORIGINAL CREATURE  ·  HT: 1.2 m  ·  WT: 24.0 kg
      </text>

      <rect x="48" y={abilityAreaY} width="564" height={abilityAreaHeight} rx="4" fill="#fff" fillOpacity="0.28" stroke={theme.dark} strokeOpacity="0.22" />
      {abilities.length === 0 ? (
        <text x="330" y="630" textAnchor="middle" fill={theme.dark} fillOpacity="0.6" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">Add an ability to complete the card</text>
      ) : abilities.map((ability, index) => {
        const y = abilityAreaY + index * abilitySlotHeight + (abilitySlotHeight - abilityContentHeight) / 2
        const separatorY = abilityAreaY + index * abilitySlotHeight
        const cost = Math.min(Number(ability.energyCost) || 1, 5)
        const abilityX = 68 + cost * 32
        const abilityNameSize = Math.max(14, 23 - Math.max(0, getTextUnits(ability.name) - 11))
        const descriptionLines = wrapText(ability.description, 28, 1)
        return (
          <g key={`${ability.name}-${index}`}>
            {index > 0 && <line x1="66" y1={separatorY} x2="594" y2={separatorY} stroke={theme.dark} strokeOpacity="0.35" strokeWidth="1.2" />}
            {Array.from({ length: cost }).map((_, energyIndex) => (
              <image key={energyIndex} href={typeIcon} xlinkHref={typeIcon} x={68 + energyIndex * 32} y={y + 2} width="28" height="28" />
            ))}
            <text x={abilityX} y={y + 23} fill="#0c0d0d" fontFamily="Arial, Helvetica, sans-serif" fontSize={abilityNameSize} fontWeight="850">
              {ability.name}
            </text>
            {ability.damage && (
              <text x="582" y={y + 24} textAnchor="end" fill="#121313" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="800">
                {ability.damage}
              </text>
            )}
            <TextLines
              lines={descriptionLines}
              x="82"
              y={y + 47}
              lineHeight="15"
              fill="#252727"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="12.5"
            />
          </g>
        )
      })}

      <rect x="48" y="751" width="564" height="58" rx="4" fill={theme.dark} fillOpacity="0.12" />
      <line x1="236" y1="758" x2="236" y2="801" stroke={theme.dark} strokeOpacity="0.28" />
      <line x1="422" y1="758" x2="422" y2="801" stroke={theme.dark} strokeOpacity="0.28" />
      <text x="67" y="769" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="850" letterSpacing="0.7">WEAKNESS</text>
      {weaknessIcon ? <image href={weaknessIcon} xlinkHref={weaknessIcon} x="72" y="775" width="25" height="25" /> : <text x="82" y="795" fill={theme.dark}>—</text>}
      {weaknessIcon && <text x="105" y="795" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="850">×2</text>}
      <text x="254" y="769" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="850" letterSpacing="0.7">RESISTANCE</text>
      {resistanceIcon ? <image href={resistanceIcon} xlinkHref={resistanceIcon} x="280" y="775" width="25" height="25" /> : <text x="292" y="795" fill={theme.dark}>—</text>}
      {resistanceIcon && <text x="312" y="795" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="850">−30</text>}
      <text x="442" y="769" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="850" letterSpacing="0.7">RETREAT</text>
      {Array.from({ length: getRetreatCost(cardData.retreatCost) }).map((_, index) => (
        <image key={index} href={getTypeIcon('normal')} xlinkHref={getTypeIcon('normal')} x={444 + index * 27} y="777" width="23" height="23" />
      ))}

      <TextLines
        lines={wrapText(cardData.description, 40, 2)}
        x="330"
        y="830"
        lineHeight="17"
        textAnchor="middle"
        fill="#2f3030"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="13"
        fontStyle="italic"
      />
      <line x1="52" y1="858" x2="608" y2="858" stroke={theme.dark} strokeOpacity="0.36" />
      <text x="52" y="876" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="850">{cardData.cardNumber || '001/100'}</text>
      <text x="330" y="875" textAnchor="middle" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="750" letterSpacing="0.85">ORIGINAL CARD STUDIO • FAN-MADE • NOT FOR SALE</text>
      <text x="607" y="878" textAnchor="end" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="21" fontWeight="900">
        {raritySymbols[cardData.rarity] || raritySymbols.common}
      </text>
      <rect x="12" y="12" width="636" height="897" rx="32" fill="none" stroke="#fff8d5" strokeOpacity="0.72" strokeWidth="2" />
    </svg>
  )
}

export default CardArtwork
