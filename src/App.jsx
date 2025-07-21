import { useState } from 'react'
import PokemonCardGenerator from './components/PokemonCardGenerator'
import './App.css'
import './styles/pokemon-cards.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Card Generator</h1>
        <p>Create your own custom Pokemon-style cards!</p>
        <p className="license-info">
          <small>
            Built with <a href="https://github.com/simeydotme/pokemon-cards-css" target="_blank" rel="noopener noreferrer">
              @simeydotme/pokemon-cards-css
            </a> (GPL-3.0)
          </small>
        </p>
      </header>
      <main>
        <PokemonCardGenerator />
      </main>
      <a 
        href="https://github.com/simeydotme/pokemon-cards-css" 
        className="license-notice"
        target="_blank"
        rel="noopener noreferrer"
      >
        GPL-3.0 Licensed
      </a>
    </div>
  )
}

export default App
