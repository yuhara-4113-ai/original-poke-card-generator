const typeIcon = (name) => `${import.meta.env.BASE_URL}type-icons/${name}.svg`

export const TYPE_ICONS = {
  normal: typeIcon('normal'),
  fire: typeIcon('fire'),
  water: typeIcon('water'),
  electric: typeIcon('electric'),
  grass: typeIcon('grass'),
  ice: typeIcon('ice'),
  fighting: typeIcon('fighting'),
  poison: typeIcon('poison'),
  ground: typeIcon('ground'),
  flying: typeIcon('flying'),
  psychic: typeIcon('psychic'),
  bug: typeIcon('bug'),
  rock: typeIcon('rock'),
  ghost: typeIcon('ghost'),
  dragon: typeIcon('dragon'),
  dark: typeIcon('dark'),
  steel: typeIcon('steel'),
  fairy: typeIcon('fairy'),
}

export const TYPE_THEMES = {
  normal: { primary: '#77746d', dark: '#353432', light: '#e9e6df', surface: '#f7f4ec' },
  fire: { primary: '#dc4d36', dark: '#70251d', light: '#f7c0a5', surface: '#fff3e8' },
  water: { primary: '#2f78b7', dark: '#173f68', light: '#a9d8ed', surface: '#eef8fb' },
  electric: { primary: '#d5a91c', dark: '#6f5205', light: '#f7df78', surface: '#fff9d8' },
  grass: { primary: '#4f8d50', dark: '#264c2d', light: '#b9d99f', surface: '#f1f8e9' },
  ice: { primary: '#4d9dad', dark: '#225661', light: '#bde9e8', surface: '#eefafa' },
  fighting: { primary: '#aa5739', dark: '#58271e', light: '#dfad91', surface: '#faeee7' },
  poison: { primary: '#7a4f91', dark: '#40244f', light: '#c9add7', surface: '#f6eff9' },
  ground: { primary: '#a57837', dark: '#5b3d1d', light: '#dfc18a', surface: '#faf3df' },
  flying: { primary: '#6488ac', dark: '#344b66', light: '#c3d5e7', surface: '#f1f6fa' },
  psychic: { primary: '#b64f79', dark: '#68253e', light: '#e7abc1', surface: '#fbf0f4' },
  bug: { primary: '#76892e', dark: '#3f4b18', light: '#c8d58b', surface: '#f5f7e7' },
  rock: { primary: '#81735c', dark: '#453c30', light: '#d4c6aa', surface: '#f5f1e7' },
  ghost: { primary: '#5c5688', dark: '#302c4f', light: '#bcb5dc', surface: '#f1eff8' },
  dragon: { primary: '#755ca5', dark: '#382a61', light: '#c7b4e5', surface: '#f3effa' },
  dark: { primary: '#46474c', dark: '#191a1d', light: '#aeb0b8', surface: '#eeeff1' },
  steel: { primary: '#68777b', dark: '#344146', light: '#bdc9ca', surface: '#f1f5f4' },
  fairy: { primary: '#ba6e91', dark: '#67364d', light: '#edbed1', surface: '#fff1f6' },
}

export const getTypeTheme = (type) => TYPE_THEMES[type] || TYPE_THEMES.normal
export const getTypeIcon = (type) => TYPE_ICONS[type] || TYPE_ICONS.normal
