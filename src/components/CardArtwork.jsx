import { getTypeIcon, getTypeTheme } from './cardTheme'

const CARD_WIDTH = 660
const CARD_HEIGHT = 921
const ART_X = 47
const ART_Y = 116
const ART_WIDTH = 566
const ART_HEIGHT = 365

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

const CardArtwork = ({ cardData, imagePreview, imageAdjustment, svgRef }) => {
  const theme = getTypeTheme(cardData.type)
  const typeIcon = getTypeIcon(cardData.type)
  const abilities = cardData.abilities.filter((ability) => ability.name).slice(0, 3)
  const rowHeight = Math.min(92, 238 / Math.max(abilities.length, 1))
  const nameUnits = getTextUnits(cardData.name || '')
  const nameSize = Math.max(21, 35 - Math.max(0, nameUnits - 10) * 1.4)
  const raritySymbols = { common: '○', uncommon: '●', rare: '◆', holo: '★' }
  const naturalWidth = imageAdjustment?.width || ART_WIDTH
  const naturalHeight = imageAdjustment?.height || ART_HEIGHT
  const zoom = Math.min(2.5, Math.max(1, imageAdjustment?.zoom || 1))
  const baseImageScale = Math.max(ART_WIDTH / naturalWidth, ART_HEIGHT / naturalHeight)
  const imageWidth = naturalWidth * baseImageScale * zoom
  const imageHeight = naturalHeight * baseImageScale * zoom
  const overflowX = Math.max(0, imageWidth - ART_WIDTH)
  const overflowY = Math.max(0, imageHeight - ART_HEIGHT)
  const imageX = ART_X - overflowX / 2 + ((imageAdjustment?.x || 0) / 100) * (overflowX / 2)
  const imageY = ART_Y - overflowY / 2 + ((imageAdjustment?.y || 0) / 100) * (overflowY / 2)

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
          <rect x="48" y="80" width="410" height="36" />
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
            x={imageX}
            y={imageY}
            width={imageWidth}
            height={imageHeight}
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
        <rect x="47" y="116" width="566" height="365" fill="url(#art-shade)" />
        <rect x="47" y="116" width="566" height="365" fill="url(#soft-light)" />
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
