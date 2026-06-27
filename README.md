# Original Card Studio

A bilingual React app for designing and exporting original collectible cards. Card previews and downloaded PNGs share the same SVG renderer, so the saved image matches what users see on screen.

## Features

- Live SVG preview with subtle pointer-driven foil effects
- 18 type themes and matching type icons
- Up to three configurable abilities, damage values, retreat cost, rarity, and card number
- Local image upload with file type and 8 MB size validation
- High-resolution 1320 × 1842 PNG export
- English and Japanese interfaces
- Responsive and reduced-motion-friendly layout

## Development

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Other checks:

```bash
npm run lint
npm run build
```

## Licensing and trademarks

The interactive foil presentation is adapted from [@simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css) and distributed under GPL-3.0. See [LICENSE](./LICENSE).

This is an independent fan-made tool and is not affiliated with or endorsed by The Pokémon Company. Uploaded artwork remains in the browser and is not sent to a server by this app.
