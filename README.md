# Pokemon Card Generator

A web service for creating and downloading custom Pokémon-style card images using @simeydotme/pokemon-cards-css styles.

![Pokemon Card Generator](https://github.com/user-attachments/assets/c1c58836-9443-41d6-a33e-26da84783dcb)

## Features

- **Real-time Card Preview**: Changes update instantly as you type
- **Interactive 3D Effects**: Mouse hover creates realistic holographic effects  
- **Type-specific Styling**: Each Pokemon type has unique glow colors
- **Custom Images**: Upload your own Pokemon images
- **Multiple Abilities**: Add up to 3 custom abilities per card
- **Download Functionality**: Generates high-quality PNG images (660×921px)
- **Responsive Design**: Works on both desktop and mobile devices
- **GPL-3.0 Compliance**: Proper attribution for pokemon-cards-css

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yuhara-4113-ai/original-poke-card-generator.git
cd original-poke-card-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage

1. **Customize Your Pokemon**: Enter name, HP, type, and description
2. **Add Abilities**: Create up to 3 custom abilities with descriptions  
3. **Upload Image**: Add your own Pokemon image (square images work best)
4. **Preview Effects**: Hover over the card to see holographic effects
5. **Download**: Click the download button to get your PNG card image

## Supported Pokemon Types

- Normal, Fire, Water, Electric, Grass, Ice
- Fighting, Poison, Ground, Flying, Psychic  
- Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy

Each type has unique glow effects and styling.

## Technical Details

- **Frontend**: React with Vite
- **Styling**: CSS adapted from @simeydotme/pokemon-cards-css (GPL-3.0)
- **Image Processing**: HTML5 Canvas API
- **3D Effects**: CSS transforms with mouse interaction

## License

This project is licensed under GPL-3.0 to comply with the @simeydotme/pokemon-cards-css license.

Original pokemon-cards-css: https://github.com/simeydotme/pokemon-cards-css

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Feel free to submit issues and pull requests to improve the generator!
