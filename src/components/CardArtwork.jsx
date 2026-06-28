import { getTypeIcon, getTypeTheme } from './cardTheme'

const CARD_WIDTH = 660
const CARD_HEIGHT = 921
const ART_X = 47
const ART_Y = 116
const ART_WIDTH = 566
const ART_HEIGHT = 365
const FULL_ART_X = 30
const FULL_ART_Y = 30
const FULL_ART_WIDTH = 600
const FULL_ART_HEIGHT = 861

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
  const nameSize = Math.max(22, 38 - Math.max(0, nameUnits - 10) * 1.45)
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
          <rect x="59" y="78" width="405" height="49" />
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
      <text x="61" y="123" clipPath="url(#full-art-name-clip)" fill="#111516" fontFamily="Arial, Helvetica, sans-serif" fontSize={nameSize} fontWeight="850">
        {cardData.name || 'Untitled'}
      </text>
      <text x="466" y="107" fill="#303637" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="800">HP</text>
      <text x="548" y="113" textAnchor="end" fill="#111516" fontFamily="Arial, Helvetica, sans-serif" fontSize="35" fontWeight="850">
        {cardData.hp || '—'}
      </text>
      <circle cx="580" cy="96" r="27" fill="#fff" fillOpacity="0.86" stroke="#2b3233" strokeWidth="2" />
      <image href={typeIcon} xlinkHref={typeIcon} x="561" y="77" width="38" height="38" />

      {abilities.map((ability, index) => {
        const y = abilityStartY + index * 101
        const cost = Math.min(Number(ability.energyCost) || 1, 5)
        const abilityX = 75 + cost * 29
        const abilityNameSize = Math.max(16, 24 - Math.max(0, getTextUnits(ability.name) - 11) * 0.85)
        const descriptionLines = wrapText(ability.description, Math.max(23, 49 - cost * 2.4), 2)

        return (
          <g key={`${ability.name}-${index}`} filter="url(#full-art-panel-shadow)">
            <rect x="46" y={y} width="568" height="91" rx="17" fill="#f8faf8" fillOpacity="0.84" stroke="#d8dfdd" strokeWidth="2" />
            {Array.from({ length: cost }).map((_, energyIndex) => (
              <g key={energyIndex}>
                <circle cx={77 + energyIndex * 29} cy={y + 29} r="13" fill="#fff" stroke="#303738" strokeWidth="1.4" />
                <image href={typeIcon} xlinkHref={typeIcon} x={67 + energyIndex * 29} y={y + 19} width="20" height="20" />
              </g>
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
      {Array.from({ length: Math.min(Number(cardData.retreatCost) || 0, 5) }).map((_, index) => (
        <circle key={index} cx={132 + index * 19} cy="833" r="7" fill="#fff" stroke="#303738" strokeWidth="1.6" />
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
  const rowHeight = Math.min(92, 238 / Math.max(abilities.length, 1))
  const nameUnits = getTextUnits(cardData.name || '')
  const nameSize = Math.max(21, 35 - Math.max(0, nameUnits - 10) * 1.4)
  const raritySymbols = { common: '○', uncommon: '●', rare: '◆', holo: '★' }
  const image = getCoverLayout(imageAdjustment, {
    x: ART_X,
    y: ART_Y,
    width: ART_WIDTH,
    height: ART_HEIGHT,
  })

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
          <stop offset="0" stopColor="#fff1a5" />
          <stop offset="0.28" stopColor={theme.light} />
          <stop offset="0.62" stopColor="#b98b2f" />
          <stop offset="1" stopColor="#f7dda0" />
        </linearGradient>
        <linearGradient id="card-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.surface} />
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
        <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#07101f" floodOpacity="0.28" />
        </filter>
        <filter id="inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.dark} floodOpacity="0.32" />
        </filter>
        <clipPath id="art-clip">
          <rect x="47" y="116" width="566" height="365" rx="14" />
        </clipPath>
        <clipPath id="card-clip">
          <rect x="10" y="10" width="640" height="901" rx="33" />
        </clipPath>
        <clipPath id="header-name-clip">
          <rect x="48" y="70" width="410" height="46" />
        </clipPath>
      </defs>

      <g filter="url(#card-shadow)">
        <rect x="10" y="10" width="640" height="901" rx="33" fill="url(#card-edge)" />
        <rect x="24" y="24" width="612" height="873" rx="25" fill={theme.dark} />
        <rect x="33" y="33" width="594" height="855" rx="20" fill="url(#card-surface)" />
      </g>

      <g clipPath="url(#card-clip)" opacity="0.13" fill="none" stroke={theme.primary}>
        <circle cx="600" cy="70" r="150" strokeWidth="34" />
        <circle cx="46" cy="838" r="170" strokeWidth="44" />
        <path d="M-20 345 C170 260 240 385 402 312 S705 262 730 176" strokeWidth="16" />
      </g>

      <text x="52" y="66" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700" letterSpacing="1.7">
        ORIGINAL CREATURE
      </text>
      <text x="52" y="106" clipPath="url(#header-name-clip)" fill="#151616" fontFamily="Arial, Helvetica, sans-serif" fontSize={nameSize} fontWeight="800">
        {cardData.name || 'Untitled'}
      </text>
      <text x="474" y="94" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="17" fontWeight="700">HP</text>
      <text x="558" y="96" textAnchor="end" fill="#161616" fontFamily="Arial, Helvetica, sans-serif" fontSize="34" fontWeight="800">
        {cardData.hp || '—'}
      </text>
      <circle cx="588" cy="82" r="26" fill="#fff" fillOpacity="0.72" stroke={theme.primary} strokeWidth="2" />
      <image href={typeIcon} xlinkHref={typeIcon} x="569" y="63" width="38" height="38" />

      <g clipPath="url(#art-clip)">
        <rect x="47" y="116" width="566" height="365" fill="url(#art-placeholder)" />
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
            <circle cx="330" cy="275" r="104" fill="#fff" fillOpacity="0.16" />
            <circle cx="330" cy="275" r="65" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" />
            <path d="M292 289l42-54 31 40 21-24 42 55H272z" fill="#fff" fillOpacity="0.82" />
            <circle cx="302" cy="244" r="11" fill={theme.primary} />
            <text x="330" y="349" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fontWeight="700" letterSpacing="0.5">ADD YOUR ARTWORK</text>
          </g>
        )}
        <rect data-export-effect="artwork-lighting" x="47" y="116" width="566" height="365" fill="url(#art-shade)" />
        <rect data-export-effect="artwork-lighting" x="47" y="116" width="566" height="365" fill="url(#soft-light)" />
      </g>
      <rect x="47" y="116" width="566" height="365" rx="14" fill="none" stroke={theme.dark} strokeWidth="6" filter="url(#inner-shadow)" />
      <rect x="62" y="442" width="116" height="26" rx="13" fill={theme.dark} fillOpacity="0.9" />
      <text x="120" y="460" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1">
        {String(cardData.type || 'normal').toUpperCase()}
      </text>

      <rect x="47" y="500" width="566" height="247" rx="13" fill="#fff" fillOpacity="0.66" stroke={theme.primary} strokeOpacity="0.45" strokeWidth="2" />
      {abilities.length === 0 ? (
        <text x="330" y="628" textAnchor="middle" fill={theme.dark} fillOpacity="0.56" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">Add an ability to complete the card</text>
      ) : abilities.map((ability, index) => {
        const y = 523 + index * rowHeight
        const cost = Math.min(Number(ability.energyCost) || 1, 5)
        const abilityX = 69 + cost * 31
        const abilityNameSize = Math.max(16, 23 - Math.max(0, getTextUnits(ability.name) - 11) * 0.85)
        const descriptionLines = wrapText(ability.description, Math.max(24, 52 - cost * 2.5), 2)
        return (
          <g key={`${ability.name}-${index}`}>
            {index > 0 && <line x1="67" y1={y - 13} x2="593" y2={y - 13} stroke={theme.primary} strokeOpacity="0.27" />}
            {Array.from({ length: cost }).map((_, energyIndex) => (
              <g key={energyIndex}>
                <circle cx={82 + energyIndex * 31} cy={y + 17} r="13" fill="#fff" stroke={theme.primary} strokeWidth="1.5" />
                <image href={typeIcon} xlinkHref={typeIcon} x={72 + energyIndex * 31} y={y + 7} width="20" height="20" />
              </g>
            ))}
            <text x={abilityX} y={y + 23} fill="#121313" fontFamily="Arial, Helvetica, sans-serif" fontSize={abilityNameSize} fontWeight="800">
              {ability.name}
            </text>
            {ability.damage && (
              <text x="582" y={y + 24} textAnchor="end" fill="#121313" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="800">
                {ability.damage}
              </text>
            )}
            <TextLines
              lines={descriptionLines}
              x={abilityX}
              y={y + 47}
              lineHeight="17"
              fill="#303333"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="14"
            />
          </g>
        )
      })}

      <line x1="55" y1="772" x2="605" y2="772" stroke={theme.dark} strokeOpacity="0.35" />
      <TextLines
        lines={wrapText(cardData.description, 65, 2)}
        x="330"
        y="800"
        lineHeight="20"
        textAnchor="middle"
        fill="#2f3030"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="15"
        fontStyle="italic"
      />

      <g transform="translate(53 843)">
        <text x="0" y="12" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.8">RETREAT</text>
        {Array.from({ length: Math.min(Number(cardData.retreatCost) || 0, 5) }).map((_, index) => (
          <circle key={index} cx={78 + index * 20} cy="8" r="7" fill="#fff" stroke={theme.dark} strokeWidth="1.8" />
        ))}
      </g>
      <text x="330" y="855" textAnchor="middle" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1.1">
        FAN-MADE • NOT FOR SALE
      </text>
      <text x="53" y="879" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="800">{cardData.cardNumber || '001/100'}</text>
      <text x="607" y="880" textAnchor="end" fill={theme.dark} fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="800">
        {raritySymbols[cardData.rarity] || raritySymbols.common}
      </text>
    </svg>
  )
}

export default CardArtwork
